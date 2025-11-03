import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { formatNumber } from '../utils/dataGenerator'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#FF6B9D', '#C44569', '#1B9CFC', '#55E6C1']

interface PieChartProps {
  data: any[]
  dataKey: string
  nameKey: string
  colors?: string[]
  title?: string
  isVolume?: boolean
  showCountry?: boolean | string[]
}

export function PieChart({ data, dataKey, nameKey, colors = COLORS, title, isVolume = false, showCountry = false }: PieChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const total = data.reduce((sum, entry) => sum + (entry[dataKey] || 0), 0)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0]
      const dataEntry = item.payload || {}
      const actualName = dataEntry[nameKey] || item.name || 'Unknown'
      const value = item.value || 0
      const percentage = total > 0 ? (value / total) * 100 : 0
      const valueLabel = isVolume ? 'Units' : 'Value'
      const nameLabel = nameKey === 'disease' ? 'Disease' : nameKey === 'region' ? 'Region' : nameKey === 'brand' ? 'Brand' : nameKey === 'channel' ? 'Channel' : nameKey === 'gender' ? 'Gender' : 'Category'
      const country = dataEntry.country
      
      // Handle multiple countries
      const countriesToShow = Array.isArray(showCountry) ? showCountry : (showCountry && country ? [country] : [])
      
      return (
        <div className={`p-3 rounded-lg border-2 ${
          isDark 
            ? 'bg-navy-card border-electric-blue text-white' 
            : 'bg-white border-electric-blue text-gray-900'
        }`}>
          <p className="font-bold text-sm mb-2">{nameLabel}: {actualName}</p>
          {countriesToShow.length > 0 && (
            <p className="text-sm mb-1">
              {countriesToShow.length === 1 ? 'Country' : 'Countries'}: <strong>{countriesToShow.join(', ')}</strong>
            </p>
          )}
          <p className="text-sm">
            {valueLabel}: <strong>{formatNumber(value)}</strong>
          </p>
          <p className="text-sm">
            Percentage: <strong>{percentage.toFixed(1)}%</strong>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        {title && (
          <text
            x="50%"
            y="30"
            textAnchor="middle"
            dominantBaseline="middle"
            className={`text-xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {title}
          </text>
        )}
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={false}
          outerRadius={120}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ 
            color: isDark ? '#FFFFFF' : '#2D3748', 
            paddingTop: '10px',
            fontSize: '11px'
          }}
          iconSize={10}
          formatter={(value, entry: any) => {
            // Get the actual name from the payload (data entry)
            const payload = entry.payload
            const actualName = payload && payload[nameKey] ? payload[nameKey] : value
            const percentage = total > 0 ? ((payload && payload[dataKey] ? payload[dataKey] : 0) / total) * 100 : 0
            return (
              <span style={{ fontSize: '11px' }}>
                {`${actualName} (${percentage.toFixed(1)}%)`}
              </span>
            )
          }}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}


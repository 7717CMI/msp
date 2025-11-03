import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { formatNumber } from '../utils/dataGenerator'

interface BarChartProps {
  data: any[]
  dataKey: string
  nameKey: string
  color?: string
  xAxisLabel?: string
  yAxisLabel?: string
  isVolume?: boolean
  showCountry?: boolean | string[]
}

export function BarChart({ data, dataKey, nameKey, color = '#0075FF', xAxisLabel, yAxisLabel, isVolume = false, showCountry = false }: BarChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value
      const valueLabel = isVolume ? 'Units' : (yAxisLabel || 'Value')
      const payloadData = payload[0].payload || {}
      const country = payloadData.country
      
      // Handle multiple countries
      const countriesToShow = Array.isArray(showCountry) ? showCountry : (showCountry && country ? [country] : [])
      
      return (
        <div className={`p-3 rounded-lg border-2 ${
          isDark 
            ? 'bg-navy-card border-electric-blue text-white' 
            : 'bg-white border-electric-blue text-gray-900'
        }`}>
          <p className="font-bold text-sm mb-2">{label}</p>
          {countriesToShow.length > 0 && (
            <p className="text-sm mb-1">
              {countriesToShow.length === 1 ? 'Country' : 'Countries'}: <strong>{countriesToShow.join(', ')}</strong>
            </p>
          )}
          <p className="text-sm">
            {valueLabel}: <strong>{formatNumber(value)}</strong>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
          margin={{
            top: 5,
            right: 15,
            left: 65,
            bottom: 100,
          }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4A5568' : '#E2E8F0'} />
        <XAxis 
          dataKey={nameKey} 
          stroke={isDark ? '#FFFFFF' : '#2D3748'}
          style={{ fontSize: '10px' }}
          angle={-45}
          textAnchor="end"
          height={90}
          interval={0}
          label={{
            value: xAxisLabel || nameKey,
            position: 'insideBottom',
            offset: 5,
            style: { 
              fontSize: '11px', 
              fill: isDark ? '#FFFFFF' : '#2D3748'
            }
          }}
        />
        <YAxis 
          stroke={isDark ? '#FFFFFF' : '#2D3748'}
          style={{ fontSize: '10px' }}
          tickFormatter={(value) => formatNumber(value)}
          width={70}
          label={{
            value: yAxisLabel || 'Value',
            angle: -90,
            position: 'insideLeft',
            offset: 15,
            style: { 
              fontSize: '11px', 
              fill: isDark ? '#FFFFFF' : '#2D3748',
              textAnchor: 'middle'
            }
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey={dataKey} fill={color} radius={[8, 8, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}


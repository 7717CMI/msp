import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  Legend,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { formatWithCommas } from '../utils/dataGenerator'

interface WaterfallChartProps {
  data: Array<{
    year: string
    baseValue?: number
    incrementalValue?: number
    totalValue?: number
    isBase?: boolean
    isTotal?: boolean
  }>
  xAxisLabel?: string
  yAxisLabel?: string
  incrementalOpportunity?: number
}

export function WaterfallChart({ 
  data, 
  xAxisLabel = 'Year', 
  yAxisLabel = 'Market Value (US$ Mn)',
  incrementalOpportunity
}: WaterfallChartProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-text-secondary-light dark:text-text-secondary-dark">
        No data available
      </div>
    )
  }

  // Transform data for waterfall chart using stacked bars
  const transformedData = data.map((item, index) => {
    if (item.isBase) {
      return {
        ...item,
        base: item.baseValue || 0,
        incremental: 0,
        cumulative: item.baseValue || 0,
      }
    } else if (item.isTotal) {
      const previousItem = index > 0 ? data[index - 1] : null
      const previousCumulative = previousItem?.totalValue || 0
      return {
        ...item,
        base: item.totalValue || 0,
        incremental: 0,
        cumulative: item.totalValue || 0,
      }
    } else {
      const previousItem = index > 0 ? data[index - 1] : null
      const previousCumulative = previousItem?.isBase 
        ? previousItem.baseValue || 0
        : previousItem?.totalValue || 0
      const incremental = item.incrementalValue || 0
      return {
        ...item,
        base: previousCumulative,
        incremental: incremental,
        cumulative: previousCumulative + incremental,
      }
    }
  })

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className={`p-4 rounded-lg border-2 shadow-lg ${
          isDark 
            ? 'bg-navy-card border-electric-blue text-white' 
            : 'bg-white border-electric-blue text-gray-900'
        }`}>
          <p className="font-bold text-base mb-2">{label}</p>
          {data.isBase && (
            <p className="text-sm">
              <strong>Base Value:</strong> {formatWithCommas(data.base || 0, 1)} US$ Mn
            </p>
          )}
          {data.isTotal && (
            <p className="text-sm">
              <strong>Total Value:</strong> {formatWithCommas(data.base || 0, 1)} US$ Mn
            </p>
          )}
          {!data.isBase && !data.isTotal && (
            <>
              <p className="text-sm">
                <strong>Incremental Opportunity:</strong> {formatWithCommas(data.incremental || 0, 1)} US$ Mn
              </p>
              <p className="text-sm">
                <strong>Cumulative:</strong> {formatWithCommas(data.cumulative || 0, 1)} US$ Mn
              </p>
            </>
          )}
        </div>
      )
    }
    return null
  }

  // Colors matching the screenshot: dark blue for base/total, light blue for incremental
  const baseColor = '#1E3A8A' // Dark blue
  const incrementalColor = '#60A5FA' // Light blue

  return (
    <div className="relative w-full h-full">
      {/* Demo Data Watermark */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        style={{ opacity: 0.12 }}
      >
        <span 
          className="text-4xl font-bold text-gray-400 dark:text-gray-600 select-none"
          style={{ transform: 'rotate(-45deg)', transformOrigin: 'center' }}
        >
          Demo Data
        </span>
      </div>
      
      {/* Incremental Opportunity Arrow/Label - matching screenshot style */}
      {incrementalOpportunity && (
        <div className="absolute top-4 left-0 right-0 z-20" style={{ paddingLeft: '80px', paddingRight: '40px' }}>
          <div className="relative flex items-center h-10">
            {/* Arrow body - blue background spanning across */}
            <div className="flex-1 h-full bg-blue-600 flex items-center justify-center">
              <p className="text-sm font-semibold text-white whitespace-nowrap">
                Incremental Opportunity: {formatWithCommas(incrementalOpportunity, 1)} US$ Mn
              </p>
            </div>
            {/* Arrow head pointing right */}
            <div 
              className="flex-shrink-0"
              style={{
                width: '0',
                height: '0',
                borderLeft: '24px solid #2563EB',
                borderTop: '20px solid transparent',
                borderBottom: '20px solid transparent',
              }}
            ></div>
          </div>
        </div>
      )}

      <ResponsiveContainer width="100%" height="100%" className="relative z-10">
        <RechartsBarChart
          data={transformedData}
          margin={{
            top: 60,
            right: 40,
            left: 80,
            bottom: 100,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4A5568' : '#EAEAEA'} />
          <XAxis 
            dataKey="year"
            stroke={isDark ? '#A0AEC0' : '#4A5568'}
            style={{ fontSize: '13px', fontWeight: 500 }}
            tick={{ fill: isDark ? '#E2E8F0' : '#2D3748', fontSize: 12 }}
            tickMargin={10}
            label={{
              value: xAxisLabel,
              position: 'insideBottom',
              offset: -5,
              style: { 
                fontSize: '14px', 
                fontWeight: 500,
                fill: isDark ? '#E2E8F0' : '#2D3748'
              }
            }}
          />
          <YAxis 
            stroke={isDark ? '#A0AEC0' : '#4A5568'}
            style={{ fontSize: '13px', fontWeight: 500 }}
            tickFormatter={(value) => formatWithCommas(value, 0)}
            width={90}
            tick={{ fill: isDark ? '#E2E8F0' : '#2D3748' }}
            tickMargin={15}
            domain={[0, 'auto']}
            label={{
              value: yAxisLabel,
              angle: -90,
              position: 'insideLeft',
              offset: -10,
              style: { 
                fontSize: '14px', 
                fontWeight: 500,
                fill: isDark ? '#E2E8F0' : '#2D3748',
                textAnchor: 'middle'
              }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke={isDark ? '#A0AEC0' : '#4A5568'} />
          {/* Custom Legend */}
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            content={() => (
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: baseColor }}
                  ></div>
                  <span className="text-sm text-text-primary-light dark:text-text-primary-dark">
                    (US$ Mn)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: incrementalColor }}
                  ></div>
                  <span className="text-sm text-text-primary-light dark:text-text-primary-dark">
                    Absolute $ Opportunity
                  </span>
                </div>
              </div>
            )}
          />
          
          {/* Base bars (for base and total) - dark blue */}
          <Bar 
            dataKey="base" 
            stackId="waterfall" 
            radius={[0, 0, 0, 0]}
            name="baseValue"
            legendType="rect"
            hide={false}
          >
            {transformedData.map((entry, index) => {
              if (entry.isBase || entry.isTotal) {
                return <Cell key={`cell-base-${index}`} fill={baseColor} />
              }
              return <Cell key={`cell-base-${index}`} fill={incrementalColor} />
            })}
          </Bar>
          
          {/* Incremental bars - light blue */}
          <Bar 
            dataKey="incremental" 
            stackId="waterfall" 
            radius={[0, 0, 0, 0]}
            name="incrementalValue"
            legendType="rect"
            hide={false}
          >
            {transformedData.map((entry, index) => {
              if (entry.isBase || entry.isTotal) {
                return <Cell key={`cell-incremental-${index}`} fill="transparent" />
              }
              return <Cell key={`cell-incremental-${index}`} fill={incrementalColor} />
            })}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}


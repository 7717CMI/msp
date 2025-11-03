export function Logo({ isCollapsed = false }: { isCollapsed?: boolean }) {
  if (isCollapsed) {
    return null
  }
  
  return (
    <div className="flex flex-col">
      <span className="text-lg font-sans text-[#1a237e] dark:text-[#3f51b5] font-bold leading-tight uppercase">
        COHERENT
      </span>
      <span className="text-xs font-sans text-[#1a237e] dark:text-[#3f51b5] tracking-[0.15em] leading-tight uppercase">
        MARKET INSIGHTS
      </span>
    </div>
  )
}


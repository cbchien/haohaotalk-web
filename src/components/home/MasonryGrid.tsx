import { useCallback, useEffect, useRef, useState } from 'react'

interface MasonryGridProps {
  children: React.ReactNode[]
  gap?: number
  minColumnWidth?: number
  className?: string
}

export const MasonryGrid = ({
  children,
  gap = 12,
  minColumnWidth = 280,
  className = '',
}: MasonryGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerHeight, setContainerHeight] = useState(0)

  const layoutItems = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const containerWidth = container.offsetWidth
    const columnCount = Math.max(2, Math.floor(containerWidth / minColumnWidth))
    const columnWidth = (containerWidth - gap * (columnCount - 1)) / columnCount

    // Track height of each column
    const columnHeights = new Array(columnCount).fill(0)

    // Get all child elements
    const items = Array.from(container.children) as HTMLElement[]

    items.forEach((item) => {
      // Skip if this is not a scenario card (might be loading states, etc.)
      if (!item.classList.contains('masonry-item')) return

      // Find the shortest column
      const shortestColumnIndex = columnHeights.indexOf(
        Math.min(...columnHeights)
      )

      // Position the item
      item.style.position = 'absolute'
      item.style.left = `${shortestColumnIndex * (columnWidth + gap)}px`
      item.style.top = `${columnHeights[shortestColumnIndex]}px`
      item.style.width = `${columnWidth}px`

      // Update the column height
      columnHeights[shortestColumnIndex] += item.offsetHeight + gap
    })

    // Set container height to the tallest column
    const maxHeight = Math.max(...columnHeights) - gap
    setContainerHeight(maxHeight)
  }, [gap, minColumnWidth])

  useEffect(() => {
    // Initial layout
    const timer = setTimeout(layoutItems, 0)

    // Handle window resize
    const handleResize = () => {
      layoutItems()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [children, layoutItems])

  // Re-layout when children change or images load
  useEffect(() => {
    const timer = setTimeout(layoutItems, 100)
    return () => clearTimeout(timer)
  }, [children, layoutItems])

  // Handle image loading
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const images = container.querySelectorAll('img')
    let loadedImages = 0

    const handleImageLoad = () => {
      loadedImages++
      if (loadedImages === images.length) {
        layoutItems()
      }
    }

    images.forEach(img => {
      if (img.complete) {
        handleImageLoad()
      } else {
        img.addEventListener('load', handleImageLoad)
        img.addEventListener('error', handleImageLoad)
      }
    })

    return () => {
      images.forEach(img => {
        img.removeEventListener('load', handleImageLoad)
        img.removeEventListener('error', handleImageLoad)
      })
    }
  }, [children, layoutItems])

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ height: containerHeight }}
    >
      {children.map((child, index) => (
        <div key={index} className="masonry-item">
          {child}
        </div>
      ))}
    </div>
  )
}
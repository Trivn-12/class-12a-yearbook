import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react'

const ResponsiveSignatureCanvas = forwardRef(({ onSignatureChange, lineWidth = 2 }, ref) => {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isEmpty, setIsEmpty] = useState(true)
  const [lastPoint, setLastPoint] = useState(null)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })
  const [displaySize, setDisplaySize] = useState({ width: 400, height: 300 })
  const callbackTimeoutRef = useRef(null)

  useEffect(() => {
    // Responsive canvas size - Optimized for mobile performance
    const updateCanvasSize = () => {
      const screenWidth = window.innerWidth
      const isMobile = screenWidth < 640
      const pixelRatio = window.devicePixelRatio || 1

      let displayWidth, displayHeight, scale

      if (isMobile) {
        // Mobile: Smaller size for better performance
        displayWidth = Math.min(300, screenWidth - 40)
        displayHeight = 180
        scale = Math.min(2, pixelRatio) // Limit scale on mobile
      } else if (screenWidth < 768) {
        // Tablet
        displayWidth = 400
        displayHeight = 240
        scale = Math.max(2, pixelRatio)
      } else {
        // Desktop
        displayWidth = 500
        displayHeight = 300
        scale = Math.max(2, pixelRatio)
      }

      setCanvasSize({
        width: displayWidth * scale,
        height: displayHeight * scale
      })
      setDisplaySize({
        width: displayWidth,
        height: displayHeight
      })
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    return () => {
      window.removeEventListener('resize', updateCanvasSize)
      if (callbackTimeoutRef.current) {
        clearTimeout(callbackTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const scale = canvasSize.width / displaySize.width

    // Clear and reset transform
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)

    // Set scale
    ctx.scale(scale, scale)

    // Configure drawing settings
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // Fill white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, displaySize.width, displaySize.height)
  }, [canvasSize, displaySize, lineWidth])

  const getEventPos = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    let clientX, clientY
    if (e.touches && e.touches.length > 0) {
      // Mobile touch
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      // Touch end event
      clientX = e.changedTouches[0].clientX
      clientY = e.changedTouches[0].clientY
    } else {
      // Mouse
      clientX = e.clientX
      clientY = e.clientY
    }

    // Calculate precise coordinates with proper scaling
    const scaleX = displaySize.width / rect.width
    const scaleY = displaySize.height / rect.height

    return {
      x: Math.round((clientX - rect.left) * scaleX),
      y: Math.round((clientY - rect.top) * scaleY)
    }
  }

  const drawLine = (from, to) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
  }

  const drawDot = (point) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    ctx.beginPath()
    ctx.arc(point.x, point.y, lineWidth / 2, 0, Math.PI * 2)
    ctx.fill()
  }

  // Debounced callback for performance
  const debouncedCallback = (canvas) => {
    if (callbackTimeoutRef.current) {
      clearTimeout(callbackTimeoutRef.current)
    }

    callbackTimeoutRef.current = setTimeout(() => {
      if (onSignatureChange) {
        onSignatureChange(canvas)
      }
    }, 16) // ~60fps
  }

  const startDrawing = (e) => {
    e.preventDefault()
    e.stopPropagation()

    setIsDrawing(true)
    setIsEmpty(false)

    const pos = getEventPos(e)
    setLastPoint(pos)

    // Draw a dot for single clicks/taps
    drawDot(pos)

    // Immediate callback for responsiveness
    if (onSignatureChange) {
      onSignatureChange(canvasRef.current)
    }
  }

  const draw = (e) => {
    if (!isDrawing || !lastPoint) return
    e.preventDefault()
    e.stopPropagation()

    const pos = getEventPos(e)

    // Skip if position hasn't changed much (reduce redundant draws)
    const distance = Math.sqrt(
      Math.pow(pos.x - lastPoint.x, 2) + Math.pow(pos.y - lastPoint.y, 2)
    )

    if (distance < 1) return // Skip tiny movements

    // Draw smooth line from last point to current point
    drawLine(lastPoint, pos)
    setLastPoint(pos)

    // Throttled callback for performance
    debouncedCallback(canvasRef.current)
  }

  const stopDrawing = (e) => {
    if (!isDrawing) return
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    setIsDrawing(false)
    setLastPoint(null)

    // Final callback
    if (onSignatureChange) {
      onSignatureChange(canvasRef.current)
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const scale = canvasSize.width / displaySize.width

    // Clear and reset
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)

    // Restore scale and settings
    ctx.scale(scale, scale)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // Fill white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, displaySize.width, displaySize.height)

    setIsEmpty(true)
    setLastPoint(null)
    if (onSignatureChange) {
      onSignatureChange(null)
    }
  }

  // Expose clearCanvas function to parent component
  useImperativeHandle(ref, () => ({
    clearCanvas
  }))

  return (
    <div className="signature-canvas-container select-none">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="signature-canvas touch-none border-2 border-gray-300 rounded-xl shadow-lg"
          style={{
            touchAction: 'none',
            width: `${displaySize.width}px`,
            height: `${displaySize.height}px`,
            maxWidth: '100%',
            cursor: 'crosshair',
            background: '#ffffff',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
          onContextMenu={(e) => e.preventDefault()}
          onSelectStart={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />

        {/* Placeholder text when empty */}
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none rounded-xl">
            <div className="text-gray-400 text-center">
              <div className="text-lg font-medium mb-1">✍️ Sign here</div>
              <div className="text-sm">Draw your signature above</div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={clearCanvas}
          className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
          disabled={isEmpty}
        >
          <span className="flex items-center gap-2">
            <span>🗑️</span>
            <span className="hidden sm:inline">Clear Signature</span>
            <span className="sm:hidden">Clear</span>
          </span>
        </button>
      </div>
    </div>
  )
})

export default ResponsiveSignatureCanvas

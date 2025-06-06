import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react'

const ResponsiveSignatureCanvas = forwardRef(({ onSignatureChange }, ref) => {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isEmpty, setIsEmpty] = useState(true)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 800 })
  const [displaySize, setDisplaySize] = useState({ width: 400, height: 400 })

  useEffect(() => {
    // Responsive canvas size - High resolution with devicePixelRatio
    const updateCanvasSize = () => {
      const screenWidth = window.innerWidth
      const pixelRatio = window.devicePixelRatio || 1

      let displayWidth, displayHeight
      if (screenWidth < 640) { // Mobile
        displayWidth = displayHeight = 280
      } else if (screenWidth < 768) { // Small tablet
        displayWidth = displayHeight = 320
      } else { // Desktop
        displayWidth = displayHeight = 400
      }

      // High resolution canvas - 2x hoặc devicePixelRatio
      const scale = Math.max(2, pixelRatio)
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
    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Scale cho high DPI
    const scale = canvasSize.width / displaySize.width
    ctx.scale(scale, scale)

    // Thiết lập canvas với độ phân giải cao
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = (window.innerWidth < 640 ? 3 : 2) / scale // Adjust line width for scale
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // Làm sạch canvas
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, displaySize.width, displaySize.height)
  }, [canvasSize, displaySize])

  const getEventPos = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    let clientX, clientY
    if (e.touches) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    // Scale coordinates to match display size
    const scaleX = displaySize.width / rect.width
    const scaleY = displaySize.height / rect.height

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    }
  }

  const startDrawing = (e) => {
    e.preventDefault()
    setIsDrawing(true)
    
    const pos = getEventPos(e)
    const ctx = canvasRef.current.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
  }

  const draw = (e) => {
    if (!isDrawing) return
    e.preventDefault()
    
    const pos = getEventPos(e)
    const ctx = canvasRef.current.getContext('2d')
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    
    setIsEmpty(false)
    if (onSignatureChange) {
      onSignatureChange(canvasRef.current)
    }
  }

  const stopDrawing = (e) => {
    if (e) e.preventDefault()
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Reset transform và clear
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height)

    // Restore scale
    const scale = canvasSize.width / displaySize.width
    ctx.scale(scale, scale)

    setIsEmpty(true)
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
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="signature-canvas touch-none border-2 border-gray-200 rounded-xl"
        style={{
          touchAction: 'none',
          width: `${displaySize.width}px`,
          height: `${displaySize.height}px`,
          maxWidth: '100%'
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        onContextMenu={(e) => e.preventDefault()}
      />
      <div className="mt-4 flex justify-center">
        <button
          onClick={clearCanvas}
          className="px-4 md:px-6 py-2 md:py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
          disabled={isEmpty}
        >
          <span className="flex items-center gap-2">
            <span className="hidden sm:inline">Clear Signature</span>
            <span className="sm:hidden">Clear</span>
          </span>
        </button>
      </div>
    </div>
  )
})

export default ResponsiveSignatureCanvas

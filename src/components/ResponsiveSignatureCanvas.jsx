import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react'

const ResponsiveSignatureCanvas = forwardRef(({ onSignatureChange }, ref) => {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isEmpty, setIsEmpty] = useState(true)
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 })

  useEffect(() => {
    // Responsive canvas size - Square format
    const updateCanvasSize = () => {
      const screenWidth = window.innerWidth
      if (screenWidth < 640) { // Mobile
        setCanvasSize({ width: 280, height: 280 })
      } else if (screenWidth < 768) { // Small tablet
        setCanvasSize({ width: 320, height: 320 })
      } else { // Desktop
        setCanvasSize({ width: 400, height: 400 })
      }
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Thiết lập canvas
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = window.innerWidth < 640 ? 3 : 2 // Thicker line on mobile
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    
    // Làm sạch canvas
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height)
  }, [canvasSize])

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
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
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
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height)
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
        className="signature-canvas touch-none w-full h-auto border-2 border-gray-200 rounded-xl"
        style={{ 
          touchAction: 'none',
          maxWidth: '100%',
          height: 'auto'
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

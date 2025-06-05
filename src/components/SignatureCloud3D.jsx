import React, { useRef, useEffect, useState, useMemo } from 'react'
import * as THREE from 'three'

const SignatureCloud3D = ({ signatures, onSignatureSelect, searchTerm, viewMode, onViewModeChange }) => {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const signaturesRef = useRef([])
  const animationRef = useRef(null)
  const [hoveredSignature, setHoveredSignature] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const raycasterRef = useRef(new THREE.Raycaster())
  const mouseRef = useRef(new THREE.Vector2())

  // Filter signatures based on search term
  const filteredSignatures = useMemo(() => {
    if (!searchTerm) return signatures
    return signatures.filter(sig => 
      sig.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [signatures, searchTerm])

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return

    const width = mountRef.current.clientWidth
    const height = mountRef.current.clientHeight

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0a0a)
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 15
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    rendererRef.current = renderer

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0x8b5cf6, 0.5, 100)
    pointLight.position.set(0, 0, 10)
    scene.add(pointLight)

    mountRef.current.appendChild(renderer.domElement)

    // Mouse interaction
    const handleMouseMove = (event) => {
      if (!mountRef.current) return

      const rect = mountRef.current.getBoundingClientRect()
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      // Raycasting for hover detection
      raycasterRef.current.setFromCamera(mouseRef.current, camera)
      const intersects = raycasterRef.current.intersectObjects(
        signaturesRef.current.map(sig => sig.group), true
      )

      if (intersects.length > 0) {
        const intersectedGroup = intersects[0].object.parent
        const signature = intersectedGroup.userData.signature
        if (signature && hoveredSignature?.id !== signature.id) {
          setHoveredSignature(signature)
          document.body.style.cursor = 'pointer'
        }
      } else {
        if (hoveredSignature) {
          setHoveredSignature(null)
          document.body.style.cursor = 'default'
        }
      }
    }

    const handleClick = (event) => {
      if (!mountRef.current) return

      const rect = mountRef.current.getBoundingClientRect()
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycasterRef.current.setFromCamera(mouseRef.current, camera)
      const intersects = raycasterRef.current.intersectObjects(
        signaturesRef.current.map(sig => sig.group), true
      )

      if (intersects.length > 0) {
        const intersectedGroup = intersects[0].object.parent
        const signature = intersectedGroup.userData.signature
        if (signature && onSignatureSelect) {
          onSignatureSelect(signature)
        }
      }
    }

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return
      const newWidth = mountRef.current.clientWidth
      const newHeight = mountRef.current.clientHeight

      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    renderer.domElement.addEventListener('mousemove', handleMouseMove)
    renderer.domElement.addEventListener('click', handleClick)
    window.addEventListener('resize', handleResize)

    return () => {
      renderer.domElement.removeEventListener('mousemove', handleMouseMove)
      renderer.domElement.removeEventListener('click', handleClick)
      window.removeEventListener('resize', handleResize)
      document.body.style.cursor = 'default'
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  // Create signature objects
  useEffect(() => {
    if (!sceneRef.current || !filteredSignatures.length) return

    // Clear existing signatures
    signaturesRef.current.forEach(sigObj => {
      sceneRef.current.remove(sigObj.group)
    })
    signaturesRef.current = []

    // Create new signature objects
    filteredSignatures.forEach((signature, index) => {
      createSignatureObject(signature, index)
    })

    // Position signatures based on view mode
    if (viewMode === 'sphere') {
      positionInSphere()
    } else {
      positionInGrid()
    }

  }, [filteredSignatures, viewMode])

  const createSignatureObject = (signature, index) => {
    const group = new THREE.Group()
    
    // Create card background
    const cardGeometry = new THREE.PlaneGeometry(2, 1.5)
    const cardMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x1a1a2e,
      transparent: true,
      opacity: 0.9
    })
    const cardMesh = new THREE.Mesh(cardGeometry, cardMaterial)
    cardMesh.receiveShadow = true
    group.add(cardMesh)

    // Create border
    const borderGeometry = new THREE.EdgesGeometry(cardGeometry)
    const borderMaterial = new THREE.LineBasicMaterial({ 
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.6
    })
    const borderMesh = new THREE.LineSegments(borderGeometry, borderMaterial)
    group.add(borderMesh)

    // Create text texture for name
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = 256
    canvas.height = 128
    
    context.fillStyle = '#1a1a2e'
    context.fillRect(0, 0, canvas.width, canvas.height)
    
    context.fillStyle = '#ffffff'
    context.font = 'bold 24px Arial'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(signature.name, canvas.width / 2, canvas.height / 2 - 10)
    
    context.fillStyle = '#8b5cf6'
    context.font = '16px Arial'
    context.fillText(signature.type === 'student' ? '🎓 Học sinh' : '👨‍🏫 Giáo viên', canvas.width / 2, canvas.height / 2 + 20)

    const textTexture = new THREE.CanvasTexture(canvas)
    const textMaterial = new THREE.MeshBasicMaterial({ 
      map: textTexture,
      transparent: true
    })
    const textMesh = new THREE.Mesh(cardGeometry, textMaterial)
    textMesh.position.z = 0.01
    group.add(textMesh)

    // Add glow effect
    const glowGeometry = new THREE.PlaneGeometry(2.2, 1.7)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0,
      side: THREE.BackSide
    })
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial)
    glowMesh.position.z = -0.01
    group.add(glowMesh)

    // Store signature data
    group.userData = { 
      signature, 
      index, 
      originalScale: 1,
      glowMesh,
      cardMesh,
      borderMesh
    }

    sceneRef.current.add(group)
    signaturesRef.current.push({ group, signature })
  }

  const positionInSphere = () => {
    const radius = 8
    signaturesRef.current.forEach(({ group }, index) => {
      const phi = Math.acos(-1 + (2 * index) / signaturesRef.current.length)
      const theta = Math.sqrt(signaturesRef.current.length * Math.PI) * phi

      const x = radius * Math.cos(theta) * Math.sin(phi)
      const y = radius * Math.sin(theta) * Math.sin(phi)
      const z = radius * Math.cos(phi)

      group.position.set(x, y, z)
      group.lookAt(0, 0, 0)
      group.userData.targetPosition = { x, y, z }
    })
  }

  const positionInGrid = () => {
    const cols = Math.ceil(Math.sqrt(signaturesRef.current.length))
    const spacing = 3

    signaturesRef.current.forEach(({ group }, index) => {
      const row = Math.floor(index / cols)
      const col = index % cols
      
      const x = (col - cols / 2) * spacing
      const y = (row - Math.ceil(signaturesRef.current.length / cols) / 2) * spacing
      const z = 0

      group.position.set(x, y, z)
      group.rotation.set(0, 0, 0)
      group.userData.targetPosition = { x, y, z }
    })
  }

  // Animation loop
  useEffect(() => {
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      if (sceneRef.current && cameraRef.current && rendererRef.current) {
        // Auto-rotate in sphere mode
        if (viewMode === 'sphere' && !hoveredSignature) {
          sceneRef.current.rotation.y += 0.005
        }

        // Smooth transitions and hover effects
        signaturesRef.current.forEach(({ group }) => {
          const target = group.userData.targetPosition
          if (target) {
            group.position.lerp(new THREE.Vector3(target.x, target.y, target.z), 0.05)
          }

          // Hover effects
          const isHovered = hoveredSignature && group.userData.signature.id === hoveredSignature.id
          const targetScale = isHovered ? 1.5 : group.userData.originalScale
          group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)

          // Glow effect
          if (group.userData.glowMesh) {
            group.userData.glowMesh.material.opacity = THREE.MathUtils.lerp(
              group.userData.glowMesh.material.opacity,
              isHovered ? 0.3 : 0,
              0.1
            )
          }

          // Border highlight
          if (group.userData.borderMesh) {
            group.userData.borderMesh.material.opacity = THREE.MathUtils.lerp(
              group.userData.borderMesh.material.opacity,
              isHovered ? 1 : 0.6,
              0.1
            )
          }
        })

        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [viewMode, hoveredSignature])

  return (
    <div className="relative w-full h-full">
      {/* 3D Canvas */}
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-pointer"
        style={{ minHeight: '600px' }}
      />
      
      {/* Controls */}
      <div className="absolute top-4 left-4 flex gap-2">
        <button
          onClick={() => onViewModeChange('sphere')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            viewMode === 'sphere' 
              ? 'bg-purple-600 text-white' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          🌐 Sphere
        </button>
        <button
          onClick={() => onViewModeChange('grid')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            viewMode === 'grid' 
              ? 'bg-purple-600 text-white' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          📋 Grid
        </button>
      </div>

      {/* Info */}
      <div className="absolute bottom-4 left-4 text-white/70 text-sm">
        {filteredSignatures.length} signatures • {viewMode} view
      </div>
    </div>
  )
}

export default SignatureCloud3D

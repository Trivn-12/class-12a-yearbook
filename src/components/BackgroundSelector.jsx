import React, { useState } from 'react'

const BackgroundSelector = ({ currentTheme, onThemeChange }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const themes = [
    { id: 'bg-gradient-1', name: 'Purple', preview: '#8b5cf6' },
    { id: 'bg-gradient-2', name: 'Blue', preview: '#3b82f6' },
    { id: 'bg-gradient-3', name: 'Cyan', preview: '#06b6d4' },
    { id: 'bg-gradient-4', name: 'Green', preview: '#10b981' },
    { id: 'bg-gradient-5', name: 'Pink', preview: '#ec4899' },
    { id: 'bg-pattern-1', name: 'Violet', preview: '#7c3aed' },
    { id: 'bg-pattern-2', name: 'Indigo', preview: '#6366f1' },
  ]

  const currentThemeData = themes.find(t => t.id === currentTheme)

  return (
    <div className="glass rounded-xl transition-all duration-300 neon-hover">
      {/* Collapsed state - Compact */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-10 h-10 rounded-lg border-2 border-purple-500/30 hover:border-purple-400 transition-all duration-300 hover:scale-110 neon-hover relative overflow-hidden"
          style={{ background: currentThemeData?.preview }}
          title="Change Background"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
        </button>
      )}

      {/* Expanded state - Compact */}
      {isExpanded && (
        <div className="p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white text-xs font-bold flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full neon-pulse"></div>
              Themes
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-white/70 hover:text-white text-sm font-bold hover:scale-110 transition-all duration-300 w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/20"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  onThemeChange(theme.id)
                  setIsExpanded(false)
                }}
                className={`
                  w-8 h-8 rounded-lg border-2 transition-all duration-300 hover:scale-110 relative overflow-hidden
                  ${currentTheme === theme.id
                    ? 'border-white shadow-lg scale-110'
                    : 'border-purple-500/30 hover:border-purple-400'
                  }
                `}
                style={{
                  background: theme.preview,
                  boxShadow: currentTheme === theme.id ? '0 0 15px rgba(139, 92, 246, 0.5)' : 'none'
                }}
                title={theme.name}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BackgroundSelector

import React, { useState } from 'react'



export const InputArray = ({ onTagsChange, label = '', tagsDefault = [] }) => {
  const [tags, setTags] = useState(tagsDefault)
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault()
      const newTags = [...tags, inputValue.trim()]
      setTags(newTags)
      setInputValue('')
      if (onTagsChange) {
        onTagsChange(newTags)
      }
    }
  }

  const removeTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index)
    setTags(newTags)
    if (onTagsChange) {
      onTagsChange(newTags)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <div key={index} className="flex items-center bg-blue-100 border-blue-200 py-1.5 pr-2 pl-3 border rounded-xl font-medium text-blue-700 text-sm transition-all animate-in fade-in zoom-in duration-200">
            {tag}
            <button 
              type="button" 
              className="hover:bg-blue-200 ml-2 p-0.5 rounded-lg text-blue-400 hover:text-blue-600 transition-colors" 
              onClick={() => removeTag(index)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="relative">

        <input
          type="text"
          value={inputValue}
          className="bg-amber-50 px-4 py-2.5 border-2 border-amber-200 focus:border-amber-500 rounded-xl focus:ring-4 focus:ring-amber-500/10 w-full text-slate-900 transition-all outline-none placeholder:text-amber-300 font-semibold"
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Escriba y presione Enter para agregar ${label}...`}
        />
        <div className="top-1/2 right-4 absolute -translate-y-1/2 pointer-events-none">
          <kbd className="hidden sm:inline-block bg-slate-100 px-2 py-0.5 border border-slate-200 rounded font-sans text-slate-400 text-xs">Enter</kbd>
        </div>
      </div>
    </div>
  )
}

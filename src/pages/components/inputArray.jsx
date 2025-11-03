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
    <div className="input-array-container">
      <div className="flex flex-wrap gap-2 mb-2 max-w-[850px]">
        {tags.map((tag, index) => (
          <div key={index} className="flex items-center bg-gray-200 px-2 py-1 rounded-2xl text-gray-700 text-xs tag-item">
            {tag}
            <button type="button" className="flex justify-center items-center bg-gray-500 hover:bg-gray-700 ml-2 px-[5px] rounded-full text-white text-sm" onClick={() => removeTag(index)}>
              ×
            </button>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        className="shadow-sm mt-1 p-2 border border-slate-300 focus:border-blue-500 rounded-md focus:ring-blue-500 w-full text-slate-400"
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`Escriba y presione Enter para agregar ${label}`}
      />
    </div>
  )
}

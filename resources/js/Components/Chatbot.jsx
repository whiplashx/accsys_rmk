'use client'

import React from 'react'
import { ChevronDown, Globe, Send } from 'lucide-react'

export default function CopilotInterface() {
  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/placeholder.svg"
            alt="Copilot Logo"
            className="w-6 h-6 text-orange-500"
          />
          <span className="font-semibold">Copilot</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1 text-sm bg-transparent hover:bg-gray-100 rounded">
            <Globe className="h-4 w-4" />
            en
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Quality Toggle */}
      <div className="flex items-center justify-center gap-2">
        <button className="px-4 py-2 border rounded-md bg-white text-primary">
          Standard
        </button>
        <button className="px-4 py-2 border rounded-md hover:bg-gray-100">
          <span className="flex items-center gap-2">
            High Quality
          </span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        <button className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100">Conclusions</button>
        <button className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100">Methods used</button>
        <button className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100">Explain Abstract</button>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <button className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100">Summarise introduction</button>
        <button className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100">Contributions</button>
        <button className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100">Paper Summary</button>
      </div>
      <div className="flex justify-center">
        <button className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100">Practical Implications</button>
      </div>

      {/* Input Area */}
      <div className="relative">
        <input
          className="w-full px-4 py-2 pr-24 border rounded-md"
          placeholder="Generate summary of this paper, Results of the paper, Conc"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <button className="px-3 py-1 text-sm bg-transparent hover:bg-gray-100 rounded">
            MATH
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}


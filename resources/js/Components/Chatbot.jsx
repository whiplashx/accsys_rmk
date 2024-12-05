'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Toggle } from "@/components/ui/toggle"
import { ChevronDown, Globe, Send } from 'lucide-react'
import Image from "next/image"

export default function CopilotInterface() {
  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/placeholder.svg"
            alt="Copilot Logo"
            width={24}
            height={24}
            className="text-orange-500"
          />
          <span className="font-semibold">Copilot</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2">
            <Globe className="h-4 w-4" />
            en
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Quality Toggle */}
      <div className="flex items-center justify-center gap-2">
        <Toggle
          variant="outline"
          aria-label="Toggle standard"
          className="data-[state=on]:bg-white data-[state=on]:text-primary"
          pressed
        >
          Standard
        </Toggle>
        <Toggle
          variant="outline"
          aria-label="Toggle high quality"
          className="data-[state=on]:bg-white data-[state=on]:text-primary"
        >
          <span className="flex items-center gap-2">
            High Quality
          </span>
        </Toggle>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="outline" size="sm">Conclusions</Button>
        <Button variant="outline" size="sm">Methods used</Button>
        <Button variant="outline" size="sm">Explain Abstract</Button>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="outline" size="sm">Summarise introduction</Button>
        <Button variant="outline" size="sm">Contributions</Button>
        <Button variant="outline" size="sm">Paper Summary</Button>
      </div>
      <div className="flex justify-center">
        <Button variant="outline" size="sm">Practical Implications</Button>
      </div>

      {/* Input Area */}
      <div className="relative">
        <Input
          className="pr-24"
          placeholder="Generate summary of this paper, Results of the paper, Conc"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <Button variant="ghost" size="sm">
            MATH
          </Button>
          <Button size="icon" variant="ghost">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}


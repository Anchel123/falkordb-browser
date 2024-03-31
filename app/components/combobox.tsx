"use client"

import { useState, Dispatch, createRef } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import Dropzone from "react-dropzone"
import { Label } from "@/components/ui/label"

/* eslint-disable react/require-default-props */
interface ComboboxProps {
  className?: string,
  type?: string,
  options: string[],
  addOption?: Dispatch<string> | null,
  selectedValue: string,
  setSelectedValue: Dispatch<string>
}

export default function Combobox({ className = '', type = '', options, addOption = null, selectedValue, setSelectedValue }: ComboboxProps) {

  const [file, setFile] = useState<File | null>(null)
  const [open, setOpen] = useState(false)
  const inputRef = createRef<HTMLInputElement>()
  const entityType = type ?? ""

  const onAddOption = () => {
    if (file) {
      const formData = new FormData()
      formData.set(`file`, file)
      fetch("api/upload", {
        method: "POST",
        body: formData
      }).then(res => res.json()).then(data => {
        addOption = null
        console.log(data)
      })
    }
    setOpen(false)
    if (!inputRef.current?.value) {
      return
    }
    if (addOption) {
      addOption(inputRef.current.value)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-[200px] justify-between ${className} `}
        >
          {selectedValue
            ? options.find((option) => option === selectedValue)
            : `Select ${entityType}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option}
                onSelect={(currentValue) => {
                  if (currentValue !== selectedValue) {
                    setSelectedValue(option)
                  }
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedValue === option ? "opacity-100" : "opacity-0"
                  )}
                />
                {option}
              </CommandItem>
            ))}
            <Separator orientation="horizontal" />

            {addOption &&
              <Dialog>
                <DialogTrigger>
                  <CommandItem>Create new {entityType}...</CommandItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create a new {entityType}?</DialogTitle>
                    <DialogDescription className="flex flex-col gap-4">
                      <Input type="text" ref={inputRef} id="create" name="create" onKeyDown={(e) => e.key === "Enter" && onAddOption()} placeholder={`${entityType} name ...`} />
                      <Dropzone onDrop={(acceptedFiles) => setFile(acceptedFiles[0])} accept={{ 'text/csv': [] }}>
                        {({ getRootProps, getInputProps }) => (
                          <div>
                            <Label htmlFor="dropzone">Import graph data: </Label>
                            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                            <div id="dropzone" {...getRootProps()} className="border-2 border-dashed border-gray-800 rounded-md p-8 text-center cursor-pointer">
                              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                              <input {...getInputProps()} />
                              {/* eslint-disable-next-line react/no-unescaped-entities */}
                              <p className="text-gray-600">Drag 'n' drop some files here, or click to select files</p>
                            </div>
                          </div>
                        )}
                      </Dropzone>
                    </DialogDescription>
                  </DialogHeader>
                  <Button className="p-4" type="submit" onClick={onAddOption}>Create</Button>
                </DialogContent>
              </Dialog>
            }
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
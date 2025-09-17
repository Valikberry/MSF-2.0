"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Camera, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CustomFoodImageUpload() {
  const [open, setOpen] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [selectedTab, setSelectedTab] = useState("upload")

  const defaultFoodImages = [
    "/placeholder.svg?height=200&width=200",
    "/placeholder.svg?height=200&width=200",
    "/placeholder.svg?height=200&width=200",
    "/placeholder.svg?height=200&width=200",
    "/placeholder.svg?height=200&width=200",
    "/placeholder.svg?height=200&width=200",
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages: string[] = []

      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            newImages.push(event.target.result as string)
            if (newImages.length === files.length) {
              setUploadedImages((prev) => [...prev, ...newImages])
            }
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Camera className="h-4 w-4 mr-2" />
          Customize with Food Images
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Customize Your Food Images</DialogTitle>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Images</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4 mt-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">Upload your own food images to personalize your experience</p>
              <Label
                htmlFor="image-upload"
                className="bg-green-600 text-white px-4 py-2 rounded-md inline-block cursor-pointer hover:bg-green-700"
              >
                Select Images
              </Label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            {uploadedImages.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Your Uploaded Images</h3>
                <div className="grid grid-cols-3 gap-2">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="relative h-24 w-full">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Uploaded ${index}`}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <button
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="gallery" className="mt-4">
            <p className="text-sm text-gray-600 mb-4">Select from our gallery of food images:</p>

            <div className="grid grid-cols-3 gap-2">
              {defaultFoodImages.map((image, index) => (
                <div key={index} className="relative group cursor-pointer">
                  <div className="relative h-24 w-full">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Gallery ${index}`}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="absolute inset-0 bg-green-600 bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-md"></div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4">
          <Button className="w-full bg-green-600 hover:bg-green-700">Save Preferences</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

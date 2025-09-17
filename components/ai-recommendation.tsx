"use client"

import { useState } from "react"
import Image from "next/image"
import { TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AiRecommendation() {
  const [open, setOpen] = useState(false)

  const recommendedMeals = [
    {
      id: "m1",
      name: "High Protein Chicken Bowl",
      calories: 420,
      protein: 35,
      carbs: 30,
      fat: 15,
      image: "/placeholder.svg?height=200&width=200",
      ingredients: ["Grilled chicken", "Brown rice", "Broccoli", "Sweet potato", "Avocado"],
    },
    {
      id: "m2",
      name: "Tofu Stir Fry",
      calories: 350,
      protein: 22,
      carbs: 25,
      fat: 12,
      image: "/placeholder.svg?height=200&width=200",
      ingredients: ["Tofu", "Bell peppers", "Snap peas", "Carrots", "Brown rice"],
    },
    {
      id: "m3",
      name: "Protein Pho",
      calories: 380,
      protein: 28,
      carbs: 40,
      fat: 8,
      image: "/placeholder.svg?height=200&width=200",
      ingredients: ["Lean beef", "Rice noodles", "Bean sprouts", "Herbs", "Bone broth"],
    },
  ]

  const recommendedIngredients = [
    {
      id: "i1",
      name: "Lean Chicken Breast",
      protein: 26,
      calories: 120,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "i2",
      name: "Tofu",
      protein: 10,
      calories: 70,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "i3",
      name: "Brown Rice",
      protein: 5,
      calories: 110,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "i4",
      name: "Whey Protein",
      protein: 24,
      calories: 120,
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100 cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-100 p-2 rounded-full">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold">AI Meal Recommendations</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Get personalized meal suggestions based on your dietary preferences and fitness goals.
          </p>
          <Button className="w-full bg-green-600 hover:bg-green-700">Get Recommendations</Button>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your Personalized Recommendations</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="meals" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="meals">Meal Ideas</TabsTrigger>
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          </TabsList>

          <TabsContent value="meals" className="space-y-4 mt-4">
            <p className="text-sm text-gray-600">
              Based on your high protein, low carb preferences, here are some meal ideas:
            </p>

            {recommendedMeals.map((meal) => (
              <Card key={meal.id}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="relative h-20 w-20 flex-shrink-0">
                      <Image
                        src={meal.image || "/placeholder.svg"}
                        alt={meal.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium">{meal.name}</h3>

                      <div className="flex gap-2 mt-1 mb-2">
                        <div className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded">
                          {meal.calories} cal
                        </div>
                        <div className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded">
                          {meal.protein}g protein
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">{meal.ingredients.join(", ")}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button className="w-full">Add All Ingredients to Cart</Button>
          </TabsContent>

          <TabsContent value="ingredients" className="mt-4">
            <p className="text-sm text-gray-600 mb-4">Recommended ingredients for your dietary goals:</p>

            <div className="grid grid-cols-2 gap-3">
              {recommendedIngredients.map((ingredient) => (
                <div key={ingredient.id} className="border rounded-lg p-3 flex items-center gap-3">
                  <div className="relative h-12 w-12 flex-shrink-0">
                    <Image
                      src={ingredient.image || "/placeholder.svg"}
                      alt={ingredient.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{ingredient.name}</h3>
                    <div className="text-xs text-gray-500">
                      {ingredient.protein}g protein • {ingredient.calories} cal
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full mt-4">Add Selected to Cart</Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

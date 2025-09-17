"use client"

import ProductCard from "@/components/product-card"


interface CardsLayerProps {
    data: any;
    category:string
}

export default function ProductCardLayer({ data,category }: CardsLayerProps) {


    return (
        <div className="grid grid-cols-2 gap-4">
            {data.map((product: any, index: number) => (
                <ProductCard key={index} product={product} category={category}/>
            ))}
        </div>
    )
}
"use client"

import { routerConfig } from "@/lib/router-config";
import { useAtom } from "jotai";
import { hoveredCardAtom } from "../atoms/homeAtoms";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function HomePage() {
    const [hoveredCard, setHoveredCard] = useAtom(hoveredCardAtom)
    const router = useRouter()

    //router push
    const handleCardClick = (path: string) =>{
        router.push(path)
    }

    //filter all routes
    const navigationItems = routerConfig.filter(
        route => !route.isPublic && route.showInSidebar
    )

    //Color mapping
    const getCardColor = (id: string) => {
        const colorMap: Record<string, string> = {
            'home': 'bg-blue-500',
            'evc': 'bg-purple-500',
            'userUpload': 'bg-green-500',
        }
        return colorMap[id] || 'bg-gray-500'
    }

    //Description mapping for routes
    const getDescription = (id: string) => {
        const descriptionMap: Record<string, string> = {
            'home': 'View dashboard and main information',
            'evc': 'Manage employee vacation calendar',
            'userUpload': 'Upload absences information for employees'
        }
        return descriptionMap[id] || "Navigate to this section"
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
                  Welcome to Your Dashboard
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Where would you like to go today?
                </p>
              </motion.div>
            </div>
    
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {navigationItems.map((route, index) => {
                const IconComponent = route.icon || (() => null);
                const color = getCardColor(route.id);
                const description = getDescription(route.id);
                
                return (
                  <motion.div
                    key={route.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    whileHover={{ scale: 1.03 }}
                    onMouseEnter={() => setHoveredCard(route.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <Link href={route.path} className="block h-full">
                      <Card className="h-full border-2 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 overflow-hidden">
                        <div className={`h-2 w-full ${color}`}></div>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className={`p-2 rounded-full ${color} bg-opacity-20`}>
                              <IconComponent className="h-6 w-6" />
                            </div>
                            <ArrowRight 
                              className={`h-5 w-5 text-gray-400 transition-all duration-300 ${
                                hoveredCard === route.id ? "translate-x-1 text-blue-500" : ""
                              }`} 
                            />
                          </div>
                          <CardTitle className="text-xl mt-3">{route.name}</CardTitle>
                          <CardDescription>{description}</CardDescription>
                        </CardHeader>
                        <CardFooter>
                          <Button 
                                variant="ghost" 
                                className="w-full justify-start hover:bg-transparent hover:text-blue-500 p-0"
                                onClick={(e) => {
                                    e.stopPropagation() //Prevenir doble navegacion
                                    handleCardClick(route.path)
                                }}
                                >
                            Go to {route.name}
                          </Button>
                        </CardFooter>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      )


}
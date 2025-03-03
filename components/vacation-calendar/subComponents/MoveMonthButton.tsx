import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { mesActualAtom } from "../atoms/atoms";


interface MoveMonthButtonProps {
    lor: "left" | "right"
}

function MoveMonthButton ({ lor }: MoveMonthButtonProps) {
    const [mesActual, setMesActual] = useAtom(mesActualAtom)

    const mesAnterior = () => {
        setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1))
    }

    const mesSiguiente = () => {
        setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1))
    }

    if (lor !== "left" && lor !== "right") {
        throw new Error("Invalid value for 'lor'. Expected 'left' or 'right' ")
    }
    return (
        <Button 
        className="p-2 hover:bg-gray-100 rounded-full"
        onClick={ lor === "left" ? mesAnterior : mesSiguiente}
        >
            {lor === "left" ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight  className="w-5 h-5"/>}
        </Button>
    )
}

export default MoveMonthButton
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MoveMonthButtonProps {
    lor: "left" | "right"
}

function MoveMonthButton ({ lor }: MoveMonthButtonProps) {
    if (lor !== "left" && lor !== "right") {
        throw new Error("Invalid value for 'lor'. Expected 'left' or 'right' ")
    }
    return (
        <Button>
            {lor === "left" ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight  className="w-5 h-5"/>}
        </Button>
    )
}

export default MoveMonthButton
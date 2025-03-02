import { diasEnMesAtom, obtenerAusencia } from "../atoms/atoms"
import { useAtomValue } from "jotai"
import { empleados } from "@/public/mockData"
import CalendarCell from "../subComponents/CalendarCell"


function Content () {
    //Atomos
    const diasEnMes = useAtomValue(diasEnMesAtom)

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="p-2 border-b text-left w-48"> Empleado </th>
                        {Array.from({ length: diasEnMes }, (_, i) => i + 1).map((dia) => (
                            <th key={ dia } className="p-2 border-b text-center w-8">
                                { dia }
                            </th>
                        ))}
                    </tr> 
                </thead>

                <tbody>
                    { empleados.map(( empleado ) => (
                        <tr key={ empleado.id }>
                            <td className="p-2 border-b">
                                <div>
                                    <div className="font-medium"> { empleado.name }</div>
                                    <div className="text-sm text-gray-500"> { empleado.department } </div>
                                </div>
                            </td>
                            { Array.from({ length: diasEnMes }, (_, i) => i + 1).map((dia) => (
                                <CalendarCell 
                                    key={ dia }
                                    dia={ dia }
                                    empleado={ empleado }
                                    obtenerAusencia={ obtenerAusencia }
                                />
                            )) }
                        </tr>
                    )) }
                </tbody>
            </table>
        </div>
        

    )
}

export { Content }
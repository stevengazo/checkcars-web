

const FileTable = () => {
    return ( 
<div>
    <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Nombre</th>
                <th className="py-3 px-6 text-left">Tipo</th>
                <th className="py-3 px-6 text-left">Tamaño</th>
                <th className="py-3 px-6 text-left">Acciones</th>
            </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
            {/* Aquí puedes mapear tus archivos */}
            <tr className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6">Archivo 1</td>
                <td className="py-3 px-6">PDF</td>
                <td className="py-3 px-6">1 MB</td>
                <td className="py-3 px-6"><button className="text-blue-500 hover:underline">Descargar</button></td>
            </tr>
            {/* Repite para más archivos */}
        </tbody>
    </table>
</div>

    )
}

export default FileTable;
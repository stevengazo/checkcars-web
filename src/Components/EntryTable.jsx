



const EntryTable = ({ entries }) => {
    return (
        <table>
        <thead>
            <tr>
            <th>Fecha</th>
            <th></th>
            </tr>
        </thead>
        <tbody>
            {entries.map((entry) => (
            <tr key={entry.id}>
                <td>{entry.id}</td>
                <td>{entry.value}</td>
            </tr>
            ))}
        </tbody>
        </table>
    );
}


export default EntryTable;
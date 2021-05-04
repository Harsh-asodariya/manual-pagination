import React, { FunctionComponent } from 'react'

interface User {
    id: string,
    name: string,
    email: string,
    phone: string
}

const commonTable: FunctionComponent<{
    currentUsers: Array<User>
}> = ({ currentUsers }) => {
    console.log(currentUsers)
    const tableData = currentUsers.map((user) => {
        return <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.phone}</td>
        </tr>
    })

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData}
                </tbody>
            </table>
        </>
    )
}

export default commonTable

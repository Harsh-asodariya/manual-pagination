import React, { useEffect, useState } from 'react'
import './table.css'
import Pagination, { Data } from './Common/pagination';
import axios from 'axios';
import CommonTable from './Common/commonTable';


function Table() {

    const [allUsers, setAllUsers] = useState([])
    const [currentUsers, setCurrentUsers] = useState([])
    const [currentPage, setCurrentPage] = useState<number | null>(null)
    const [totalPages, setTotalPages] = useState<number | null>(null)

    console.log(setCurrentPage)
    useEffect(() => {
        axios.get(`https://60880700a6f4a3001742586d.mockapi.io/user`)
            .then(res => {
                setAllUsers(res.data)
            })
            .catch(err => console.log(err))
    }, [])

    const onPageChanged = (data: Data) => {

        const { currentPage, totalPages, pageLimit } = data;

        axios.get(`https://60880700a6f4a3001742586d.mockapi.io/user?page=${currentPage}&limit=${pageLimit}`)
            .then(response => {
                setCurrentUsers(response.data)
                setCurrentPage(currentPage)
                setTotalPages(totalPages)
            })
            .catch(err => console.log(err));
    }

    const totalUsers = allUsers.length;
    let pagination = null
    if (totalUsers !== 0) {
        pagination = <Pagination totalRecords={totalUsers} pageLimit={10} pageNeighbours={1} onPageChanged={onPageChanged} />
    }
    return <>
        <div className="container mb-5">
            <div className="d-flex flex-row align-items-center my-2">
                {currentPage && (
                    <span className="current-page d-inline-block h-100 text-secondary">
                        Page <span className="font-weight-bold">{currentPage}</span> / <span className="font-weight-bold">{totalPages}</span>
                    </span>
                )}
            </div>
            <CommonTable currentUsers={currentUsers} />
            <div className="py-4 ">
                {pagination}
            </div>
        </div>
    </>;
}
export default Table

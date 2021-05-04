import React, { Component, Fragment } from 'react';

const LEFT_PAGE: string = 'LEFT';
const RIGHT_PAGE: string = 'RIGHT';

/**
 * Helper method for creating a range of numbers
 * range(1, 5) => [1, 2, 3, 4, 5]
 */
const range = (from: number, to: number, step = 1): Array<number> => {
    let i = from;
    const range = [];

    while (i <= to) {
        range.push(i);
        i += step;
    }

    return range;
}

export interface Data {
    currentPage: number,
    totalPages: number,
    pageLimit: number
}

interface MyProps {
    totalRecords: number,
    pageLimit: number,
    pageNeighbours: number,
    onPageChanged: (data : Data) => void;
}

interface PaginationData {
    currentPage : number,
    totalPages: number,
    pageLimit: number,
    totalRecords: number
}

interface MyState {
    currentPage: number
}

class Pagination extends Component<MyProps, MyState> {
    totalPages = 0
    pageNeighbours = 0
    pageLimit = 30
    totalRecords = 0
    constructor(props: MyProps) {
        super(props);
        const { totalRecords, pageLimit, pageNeighbours } = props;

        this.totalPages = Math.ceil(totalRecords / pageLimit);
        this.totalRecords = totalRecords;
        this.pageNeighbours = pageNeighbours;
        this.pageLimit = pageLimit;
        console.log(this.totalPages, 'total pages')

        this.state = { currentPage: 1 };
    }


    fetchPageNumbers = () => {
        const totalPages = this.totalPages;
        const currentPage = this.state.currentPage;
        const pageNeighbours = this.pageNeighbours;

        /**
         * totalNumbers: the total page numbers to show on the control
         * totalBlocks: totalNumbers + 2 to cover for the left(<) and right(>) controls
         */
        const totalNumbers = (this.pageNeighbours * 2) + 3;
        const totalBlocks = totalNumbers + 2;

        if (totalPages > totalBlocks) {
            const startPage = Math.max(2, currentPage - pageNeighbours);
            const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
            let pages: Array<number | string> = range(startPage, endPage);

            /**
             * hasLeftSpill: has hidden pages to the left
             * hasRightSpill: has hidden pages to the right
             * spillOffset: number of hidden pages either to the left or to the right
             */
            const hasLeftSpill = startPage > 2;
            const hasRightSpill = (totalPages - endPage) > 1;
            const spillOffset = totalNumbers - (pages.length + 1);

            switch (true) {
                // handle: (1) < {5 6} [7] {8 9} (10)
                case (hasLeftSpill && !hasRightSpill): {
                    const extraPages = range(startPage - spillOffset, startPage - 1);
                    pages = [LEFT_PAGE, ...extraPages, ...pages];
                    break;
                }

                // handle: (1) {2 3} [4] {5 6} > (10)
                case (!hasLeftSpill && hasRightSpill): {
                    const extraPages = range(endPage + 1, endPage + spillOffset);
                    pages = [...pages, ...extraPages, RIGHT_PAGE];
                    break;
                }

                // handle: (1) < {4 5} [6] {7 8} > (10)
                case (hasLeftSpill && hasRightSpill):
                default: {
                    pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
                    break;
                }
            }

            return [1, ...pages, totalPages];
        }

        return range(1, totalPages);
    }



    componentDidMount() {
        this.gotoPage(1);
    }

    gotoPage = (page: number | string) => {
        const { onPageChanged = (f: PaginationData) => f } = this.props;
        const currentPage = Math.max(0, Math.min(Number(page), this.totalPages));
        const paginationData = {
            currentPage,
            totalPages: this.totalPages,
            pageLimit: this.pageLimit,
            totalRecords: this.totalRecords
        };
        this.setState({ currentPage }, () => onPageChanged(paginationData));
    }

    handleClick = (page : number | string) => {
        this.gotoPage(page);
    }

    handleMoveLeft = () => {
        this.gotoPage(this.state.currentPage - (this.pageNeighbours * 2) - 1);
    }

    handleMoveRight = () => {
        this.gotoPage(this.state.currentPage + (this.pageNeighbours * 2) + 1);
    }

    render() {
        console.log('inn pagination', this.totalRecords, this.totalPages)
        if (!this.totalRecords || this.totalPages === 1) return null;

        const { currentPage } = this.state;
        const pages = this.fetchPageNumbers();

        return (
            <Fragment>
                <nav aria-label="Countries Pagination">
                    <ul className="pagination">
                        {pages.map((page, index) => {

                            if (page === LEFT_PAGE) return (
                                <li key={index} className="page-item">
                                    <button className="page-link" aria-label="Previous" onClick={this.handleMoveLeft}>
                                        <span aria-hidden="true">&laquo;</span>
                                        <span className="sr-only">Previous</span>
                                    </button>
                                </li>
                            );

                            if (page === RIGHT_PAGE) return (
                                <li key={index} className="page-item">
                                    <button className="page-link" aria-label="Next" onClick={this.handleMoveRight}>
                                        <span aria-hidden="true">&raquo;</span>
                                        <span className="sr-only">Next</span>
                                    </button>
                                </li>
                            );

                            return (
                                <li key={index} className={`page-item${currentPage === page ? ' active' : ''}`}>
                                    <button className="page-link" onClick={() => this.handleClick(page)}>{page}</button>
                                </li>
                            );

                        })}

                    </ul>
                </nav>
            </Fragment>
        );
    }



}


export default Pagination;
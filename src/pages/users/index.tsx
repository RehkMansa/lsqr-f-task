import { useMemo, useReducer } from "react";
import { GrDown, GrNext, GrPrevious } from "react-icons/gr";
import ErrorMessage from "../../components/blocks/ErrorMessage";
import QuickInfoBlock from "../../components/blocks/QuickInfoBlock";
import UsersTable from "../../components/blocks/UsersTable";
import { FullScreenLoader } from "../../components/elements/Loaders";
import useFetch from "../../hooks/useFetch";
import { UserResponseType } from "../../types/userResponse.type";
import { createSubArrays } from "../../utils/createSubArray";
import styled from "./Users.module.scss";
import useOnClickOutside from "../../hooks/useOnclickOutside";

const listRange = [10, 20, 50, 75, 100];

const initialState = {
    currentPage: 0,
    itemsToShow: 20,
    showDropDown: false,
};
type Action =
    | { type: "pagination"; payload: number }
    | { type: "previous" }
    | { type: "next" }
    | { type: "showRange" }
    | { type: "selectRange"; payload: number }
    | { type: "hideRange" };

const userReducer = (state: typeof initialState, action: Action) => {
    switch (action.type) {
        case "pagination":
            return { ...state, currentPage: action.payload };
        case "next":
            return { ...state, currentPage: state.currentPage + 1 };
        case "previous":
            return { ...state, currentPage: state.currentPage - 1 };
        case "showRange":
            return { ...state, showDropDown: !state.showDropDown };
        case "selectRange":
            return { ...state, itemsToShow: action.payload, showDropDown: false };
        case "hideRange":
            return { ...state, showDropDown: false };

        default:
            return state;
    }
};

const Users = () => {
    const { data, error } = useFetch<UserResponseType[]>(
        "https://6270020422c706a0ae70b72c.mockapi.io/lendsqr/api/v1/users"
    );

    const [{ currentPage, itemsToShow, showDropDown }, dispatch] = useReducer(
        userReducer,
        initialState
    ); // using a reducer function to improve performance

    const dropDownRef = useOnClickOutside<HTMLDivElement>(() =>
        dispatch({ type: "hideRange" })
    );

    const paginatedData = useMemo(
        () => createSubArrays(data ?? [], itemsToShow),
        [data, itemsToShow]
    ); // memorized to prevent function execution on each render

    if (error) return <ErrorMessage message={error.message} />;

    if (data === undefined) return <FullScreenLoader />; // type guard to prevent undefined error and show loading state

    return (
        <section className="space-y-20">
            <h1 className="text-2xl text-accent-darker font-semiMedium">Users</h1>
            <QuickInfoBlock />
            <UsersTable data={paginatedData[currentPage]} />

            <div
                className={`${styled.pagination} ${showDropDown ? styled.is_opened : ""}`}
            >
                <div className={styled.pagination__left}>
                    <p>Showing</p>
                    <div className={styled.pagination__left__inner}>
                        <div ref={dropDownRef} className={styled.pagination__dropdown}>
                            <button
                                className={styled.icon_button}
                                aria-label="Choose item range"
                                type="button"
                                onClick={() => dispatch({ type: "showRange" })}
                            >
                                {itemsToShow}
                                <GrDown />
                            </button>
                            {showDropDown && (
                                <div className={styled.list_range}>
                                    {listRange.map((num) => (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                dispatch({
                                                    type: "selectRange",
                                                    payload: num,
                                                })
                                            }
                                            key={num}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <p>out of {data.length}</p>
                    </div>
                </div>
                <div className={styled.pagination__right}>
                    {currentPage > 0 && (
                        <button
                            className={styled.icon_button}
                            type="button"
                            aria-label="Previous"
                            onClick={() => dispatch({ type: "previous" })}
                        >
                            <GrPrevious />
                        </button>
                    )}
                    {Array.from({ length: paginatedData.length }).map((_, index) => (
                        <button
                            // eslint-disable-next-line react/no-array-index-key
                            key={index}
                            className={index === currentPage ? styled.active : ""}
                            type="button"
                            onClick={() =>
                                dispatch({ type: "pagination", payload: index })
                            }
                        >
                            {index + 1}
                        </button>
                    ))}
                    {currentPage < paginatedData.length - 1 && (
                        <button
                            className={styled.icon_button}
                            type="button"
                            aria-label="next"
                            onClick={() => dispatch({ type: "next" })}
                        >
                            <GrNext />
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Users;

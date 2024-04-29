import { useEffect, useRef, useState } from "react";

import { theme } from "../../../styles/theme";

import { useLocation } from "react-router-dom";
import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";
import { DateFunction } from "../../../Functions/dateFunction";
import useFetch from "../../../Hooks/useFetch";
import { boardListDataInfo, boardListPinnedDataInfo, totalPageInfo, contestListDataInfo } from "../../../Recoil/backState";
import { boardListInterface } from "../../../Types/TypeBoard";
import Button from "../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../styles/assets/Div";
import Img from "../../../styles/assets/Img";
import { SearchInput } from "../../../styles/assets/Input";
import P from "../../../styles/assets/P";

const BoardSearch = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    const location = useLocation();
    const url = location.pathname.split("/")[2];

    const { formatDateDay } = DateFunction();

    const setBoardList = useSetRecoilState(boardListDataInfo);
    const [boardListData, fetchBoardListData] = useFetch();
    const setTotalPage = useSetRecoilState(totalPageInfo);
    const setBoardPinnedList = useSetRecoilState(boardListPinnedDataInfo);
    const [isLoading, setIsLoading] = useState(true)
    const setContestListData = useSetRecoilState(contestListDataInfo);

    let fetchUrl: string;
    if (url === "alpha") {
        fetchUrl = "/project/alpha";
    } else if (url === "beta") {
        fetchUrl = "/project/beta";
    } else if (url === "sponsor") {
        fetchUrl = "/scholarship/sponsor";
    } else if (url === "usage") {
        fetchUrl = "/scholarship/usage";
    } else if (url === "opensource") {
        fetchUrl = "/board/storage";
    } else if (url === "contest") {
        fetchUrl = "/contest/contest";
    } else if (url === "activity") {
        fetchUrl = "/contest/activity";
    } else {
        fetchUrl = `/board/${url}`;
    }

    const searchEvent = () => {
        // 토큰 없이 fetch
        if (inputRef.current !== null && inputRef.current.value !== null) {
            if (['usage', 'sponsor'].includes(url)) {
                fetchBoardListData(`${fetchUrl}?search=${inputRef.current.value}&page=0&size=15`, "GET");
            } else if (['contest', 'activity'].includes(url)) {
                fetchBoardListData(`${fetchUrl}?search=${inputRef.current.value}&page=0&size=4&orderBy=DATE_CONTEST_END`, "GET");
            }
            else {
                fetchBoardListData(`${fetchUrl}?search=${inputRef.current.value}&page=0&size=15`, "GET", "token");
            }
        }
    };

    useEffect(() => {
        if (["contest", "activity"].includes(url)) {
            if (boardListData) {
                setIsLoading(false);
                setContestListData(boardListData?.data)
                setTotalPage(boardListData.pageInfo.totalPages)
            }
        } else {
            if (boardListData) {
                const contents = boardListData.data.map((item: boardListInterface, idx: number) => ({
                    number: idx + 1,
                    id: item.id,
                    title: item.title,
                    writerName: item.writerName,
                    dateCreated: formatDateDay({ date: item.dateCreated }),
                    isPinned: item.isPinned,
                }));
                const pinnedContents = boardListData.pinnedData?.map((item: boardListInterface, idx: number) => ({
                    id: item.id,
                    title: item.title,
                    writerName: item.writerName,
                    dateCreated: formatDateDay({ date: item.dateCreated }),
                    isPinned: item.isPinned,
                }));
                setBoardPinnedList(pinnedContents);
                setBoardList(contents);
                setTotalPage(boardListData.pageInfo.totalPages);
                setIsLoading(false);
            }
        }
    }, [boardListData]);

    return (
        <>
            <Div width="263px" height="147px" $border={`2px solid`} $borderColor="border" $padding="30px 20px 10px">
                <Div $borderL={`4px solid ${theme.color.bgColor}`} $padding="5px 0 5px 20px" $margin="0 0 15px 0">
                    <P fontSize="xl" fontWeight={700}>
                        게시글 검색
                    </P>
                </Div>

                <FlexDiv wrap="nowrap">
                    <Div>
                        <SearchInput placeholder="검색어를 입력하세요." ref={inputRef} />
                    </Div>
                    <Button
                        $backgroundColor="bgColor"
                        width="53px"
                        height="40px"
                        $padding="10px 20px"
                        $borderRadius={3}
                        $HBackgroundColor="bgColorHo"
                        onClick={() => searchEvent()}
                    >
                        <Div width="13px">
                            <Img src="/images/search_white.svg"></Img>
                        </Div>
                    </Button>
                </FlexDiv>
            </Div>
        </>
    );
};

export default BoardSearch;

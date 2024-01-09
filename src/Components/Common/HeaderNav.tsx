import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { styled } from "styled-components";

import { theme } from "../../styles/theme";

import useFetch from "../../Hooks/useFetch";
import { headerNavInfo, profileInfo } from "../../Recoil/backState";

import { menuItem } from "../../Types/TypeCommon";

import { tokenAccess } from "../../Recoil/frontState";
import { Div, FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import P from "../../styles/assets/P";

const StickyDiv = styled(FlexDiv)`
    position: sticky;
    top: 0;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
`;

interface Group {
    groupName: string;
    id: number;
    menuList: menuItem[];
}

const HeaderNav = () => {
    const navigate = useNavigate();

    const menuUrl = [
        ["introduce", "activity", "honor"],
        ["board", "board", "board", "board", "board", "board"],
        ["lecture", "lecture", "lecture", "lecture"],
        ["bank/support", "bank"],
        ["board", "board"],
        ["lecture"],
    ];
    const moveMain = () => {
        navigate("/");
    };

    const movePage = (url: string) => {
        window.location.href = `${process.env.REACT_APP_BASE_URL}/${url}`;
    };

    const moveInfo = () => {
        navigate("/myInfo");
    };

    const [data, fetchData] = useFetch();
    const [infoData, fetchInfoData] = useFetch();
    const [activeGroup, setActiveGroup] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);
    const [nav, setNav] = useRecoilState(headerNavInfo);
    const [info, setInfo] = useRecoilState(profileInfo);
    const access = useRecoilValue(tokenAccess);
    const [scrollPosition, setScrollPosition] = useState(0);

    // Scroll 위치를 감지
    const updateScroll = () => {
        setScrollPosition(window.scrollY || document.documentElement.scrollTop);
    };

    useEffect(() => {
        fetchData("/menus", "GET");
        return () => {
            setNav({});
        };
    }, []);

    useEffect(() => {
        fetchInfoData("/myInfo", "GET", "token");
    }, [access]);

    useEffect(() => {
        const handleData = () => {
            if (data && typeof data === "object") {
                const newData = JSON.parse(JSON.stringify(data));
                delete newData.change;

                (Object.values(newData) as Group[]).forEach((group: Group, groupIdx: number) => {
                    if (group.menuList) {
                        group.menuList = group.menuList.map((menu: menuItem, idx: number) => ({
                            ...menu,
                            url: (menuUrl[groupIdx] && menuUrl[groupIdx][idx]) || "defaultUrl",
                        }));
                    }
                });

                setNav(newData);
            }
        };

        handleData();
    }, [data]);

    useEffect(() => {
        if (infoData) {
            setInfo(infoData);
        }
    }, [infoData]);

    useEffect(() => {
        window.addEventListener("scroll", updateScroll);
        return () => {
            window.removeEventListener("scroll", updateScroll);
        };
    }, []);

    return (
        <>
            <StickyDiv
                $zIndex={3}
                width="100%"
                height="73px"
                $backgroundColor={scrollPosition < 100 ? "none" : "wh"}
                $borderB={`0.1px solid ${theme.color.whlayer}`}
            >
                <FlexDiv width="1170px" $maxWidth="1170px" $justifycontent="space-between">
                    <Div width="200px" height="75px" $pointer onClick={moveMain}>
                        {scrollPosition < 100 ? (
                            <Img src="/images/logo_white.png" />
                        ) : (
                            <Img src="/images/logo_purple.png" />
                        )}
                    </Div>

                    <FlexDiv>
                        {nav &&
                            Object.values(nav).map((item: any, idx: number) => {
                                return (
                                    <Div $position="relative" key={idx}>
                                        <FlexDiv
                                            $pointer
                                            $margin="15px"
                                            onMouseEnter={() => setActiveGroup(item.groupName)}
                                        >
                                            <Div $margin="0 5px" $top="22px">
                                                <P
                                                    fontSize="sm"
                                                    fontWeight={800}
                                                    $letterSpacing="2px"
                                                    color={scrollPosition < 100 ? "wh" : "textColor"}
                                                >
                                                    {item.groupName}
                                                </P>
                                            </Div>
                                            <FlexDiv width="10px">
                                                {scrollPosition < 100 ? (
                                                    <Img src="/images/chevron-down_white.svg" />
                                                ) : (
                                                    <Img src="/images/chevron-down_purple.svg" />
                                                )}
                                            </FlexDiv>
                                        </FlexDiv>
                                        {activeGroup === item.groupName && (
                                            <Div
                                                $position="absolute"
                                                $margin="0 5px"
                                                $backgroundColor="wh"
                                                radius={3}
                                                width="220px"
                                                $padding="10px 0"
                                                onMouseLeave={() => setActiveGroup(null)}
                                                onClick={() => setActiveGroup(null)}
                                            >
                                                {item.menuList &&
                                                    Object.values(item.menuList).map((element: any, idx: number) => {
                                                        return (
                                                            <Div
                                                                $padding="8px 20px"
                                                                width="100%"
                                                                $pointer
                                                                key={idx}
                                                                onMouseEnter={() => setActiveMenu(element.name)}
                                                                $backgroundColor={
                                                                    activeMenu === element.name ? "bgColor" : "wh"
                                                                }
                                                                onClick={() => movePage(element.url)}
                                                            >
                                                                <Div>
                                                                    <P
                                                                        fontSize="sm"
                                                                        $letterSpacing="2px"
                                                                        color={
                                                                            activeMenu === element.name ? "wh" : "bk"
                                                                        }
                                                                    >
                                                                        {element.name}
                                                                    </P>
                                                                </Div>
                                                            </Div>
                                                        );
                                                    })}
                                            </Div>
                                        )}
                                    </Div>
                                );
                            })}

                        <FlexDiv $pointer $margin="15px">
                            <Div $margin="0 5px">
                                <P
                                    fontSize="sm"
                                    fontWeight={800}
                                    $letterSpacing="1px"
                                    color={scrollPosition < 100 ? "wh" : "textColor"}
                                >
                                    LOG OUT
                                </P>
                            </Div>
                            <FlexDiv width="15px">
                                <Img src="/images/logout_white.svg" />
                            </FlexDiv>
                        </FlexDiv>
                        <FlexDiv $margin="15px 9px">
                            <FlexDiv
                                width="35px"
                                height="35px"
                                $border="2px solid"
                                $borderColor="red"
                                radius={100}
                                overflow="hidden"
                            >
                                <Img
                                    src={info?.picture}
                                    $objectFit="cover"
                                    alt="현재 브라우저에서 지원하지 않는 형태 입니다. "
                                ></Img>
                            </FlexDiv>
                            <Div $margin="0 10px" $pointer onClick={moveInfo}>
                                <P
                                    fontSize="sm"
                                    fontWeight={600}
                                    $letterSpacing="1.5px"
                                    color={scrollPosition < 100 ? "wh" : "textColor"}
                                >
                                    {info?.name}
                                </P>
                            </Div>
                            <FlexDiv $pointer width="15px">
                                {scrollPosition < 100 ? (
                                    <Img src="/images/bell_white.svg" />
                                ) : (
                                    <Img src="/images/bell_purple.svg" />
                                )}
                            </FlexDiv>
                        </FlexDiv>
                    </FlexDiv>
                </FlexDiv>
            </StickyDiv>
        </>
    );
};

export default HeaderNav;
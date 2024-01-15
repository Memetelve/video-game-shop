import React, { useEffect, useReducer, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import constants from "../../config.json";

import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownSection,
    DropdownItem,
} from "@nextui-org/react";

interface Notification {
    text: string;
    datetime: string;
}

type State = {
    loading: boolean;
};

type Action = {
    type: "SET_LOADING";
    payload: boolean;
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_LOADING":
            return { ...state, loading: action.payload };
        default:
            throw new Error();
    }
}

export default function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [state, dispatch] = useReducer(reducer, { loading: true });

    useEffect(() => {
        const getNotifications = async () => {
            const res = await fetch(
                `${constants.API_DOMAIN}/api/v1/user/notifications`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "sessionToken"
                        )}`,
                    },
                }
            );
            const data = await res.json();
            console.log(data);

            setNotifications(data.notifications);

            dispatch({ type: "SET_LOADING", payload: false });
        };

        getNotifications();
    }, []);

    return (
        <>
            {!state.loading ? (
                <Dropdown>
                    <DropdownTrigger>
                        <IconButton className="mr-12">
                            <Badge
                                badgeContent={notifications.length}
                                color="secondary"
                            >
                                <MailIcon className="text-white" />
                            </Badge>
                        </IconButton>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="Static Actions"
                        className="bg-slate-800 text-white rounded-lg p-2"
                    >
                        {notifications.length > 0 ? (
                            notifications.map((notification, index) => {
                                return (
                                    <DropdownItem
                                        key={index}
                                        className="px-2 hover:bg-slate-600 rounded-md mr-12 text-lg mb-2"
                                    >
                                        <div className="flex flex-row">
                                            <span>
                                                {notification.datetime.slice(
                                                    5,
                                                    30
                                                )}
                                            </span>
                                            <span className="ml-2">
                                                {notification.text}
                                            </span>
                                        </div>
                                    </DropdownItem>
                                );
                            })
                        ) : (
                            <DropdownItem
                                key="no-notifications"
                                className="px-2 hover:bg-slate-600 rounded-md mr-12 text-lg mb-2"
                            >
                                <span>No notifications</span>
                            </DropdownItem>
                        )}
                    </DropdownMenu>
                </Dropdown>
            ) : (
                <div></div>
            )}
        </>
    );
}

import React from "react";
import ReactLoading from "react-loading";

interface LoadingProps {
    type: string;
}

const Loading: React.FC<LoadingProps> = ({ type }) => {
    return (
        <div>
            {type === 'bubbles' ?
            <ReactLoading type="bubbles" color="#EF4444" height={100} width={50} />
            :
            <ReactLoading type="bars" color="#EF4444" height={100} width={50} />
            }
        </div>
    )
};

export default Loading;
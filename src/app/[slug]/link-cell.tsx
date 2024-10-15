"use client";
export function LinkCell() {
    return <div className="flex flex-col h-[100px]  border-2 border-white p-5 justify-center ">
        <span className="text-yellow-500 text-xs">Invite link</span>
        <div className="">{window.location.href}</div>
    </div>;
}

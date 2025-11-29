import Link from "next/link";
import HeaderUser from "./header-user";

export default function DashboardHeader() {
    return (
        <header className=" fixed top-0 left-0 w-full bg-ds-background-200 h-16">
            <div className="flex items-center justify-between px-6 h-full">
                <div className="flex items-center gap-4">
                    <Link href="/">
                    <h1 className="text-xl font-semibold tracking-tight">💰 BudgetX</h1>
                    </Link>
                </div>
                <div className="flex items-center gap-4 h-full">
                    <HeaderUser />
                </div>
            </div>
        </header>
    )
}
export default function DashboardPageTitle({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between p-4 w-full border-b border-ds-gray-alpha-400">
            {children}
        </div>
    )
}
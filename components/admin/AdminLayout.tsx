import React from 'react';

interface AdminLayoutProps {
    children: React.ReactNode;
    sidebar: React.ReactNode;
    header: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, sidebar, header }) => {
    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-gray-800 text-white flex flex-col flex-shrink-0">
                {sidebar}
            </aside>
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-md flex-shrink-0">
                    {header}
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

import UserForm from '@/components/examples/UserForm';
import UsersQuery from '@/components/examples/UsersQuery';
import ProductTable from '@/components/examples/ProductTable';
import QueryProvider from '@/providers/QueryProvider';

export default function ExamplesPage() {
  return (
    <QueryProvider>
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">
            React Hook Form, TanStack Query & Table, Zod Examples
          </h1>
          <p className="text-center text-gray-600 mb-12">
            Comprehensive examples of form validation, data fetching, and table management
          </p>

          {/* Section 1: React Hook Form + Zod */}
          <section className="mb-16">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">
                🎯 React Hook Form + Zod Validation
              </h2>
              <p className="text-blue-800">
                Form with comprehensive validation using Zod schema and React Hook Form
              </p>
            </div>
            <UserForm />
          </section>

          {/* Section 2: TanStack Query */}
          <section className="mb-16">
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <h2 className="text-xl font-semibold text-green-900 mb-2">
                📡 TanStack Query (React Query)
              </h2>
              <p className="text-green-800">
                Data fetching with caching, mutations, and automatic refetching
              </p>
            </div>
            <UsersQuery />
          </section>

          {/* Section 3: TanStack Table */}
          <section className="mb-16">
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6">
              <h2 className="text-xl font-semibold text-purple-900 mb-2">
                📊 TanStack Table
              </h2>
              <p className="text-purple-800">
                Feature-rich table with sorting, filtering, and pagination
              </p>
            </div>
            <ProductTable />
          </section>
        </div>
      </div>
    </QueryProvider>
  );
}

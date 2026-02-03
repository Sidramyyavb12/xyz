# React Hook Form, TanStack Query, TanStack Table, and Zod Integration

This project now includes powerful form handling, data fetching, table management, and validation libraries.

## 📦 Installed Packages

### Dependencies
- **react-hook-form** (^7.49.3) - Performant, flexible forms with easy validation
- **@tanstack/react-query** (^5.17.19) - Powerful data synchronization for React
- **@tanstack/react-table** (^8.11.7) - Headless UI for building powerful tables
- **zod** (^3.22.4) - TypeScript-first schema validation
- **@hookform/resolvers** (^3.3.4) - Validation resolvers for React Hook Form

### Dev Dependencies
- **@tanstack/react-query-devtools** (^5.17.19) - Devtools for TanStack Query

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. View Examples

Navigate to `/examples` route to see all features in action:

```bash
npm run dev
# Open http://localhost:3000/examples
```

## 📚 Usage Examples

### React Hook Form + Zod Validation

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define validation schema
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

### TanStack Query (React Query)

#### Setup Provider

Wrap your app with `QueryProvider`:

```tsx
import QueryProvider from '@/providers/QueryProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
```

#### Fetching Data

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';

const fetchUsers = async () => {
  const response = await fetch('/api/users');
  return response.json();
};

export default function Users() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

#### Mutations

```tsx
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

const createUser = async (userData) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  return response.json();
};

export default function CreateUser() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return (
    <button onClick={() => mutation.mutate({ name: 'John' })}>
      Add User
    </button>
  );
}
```

### TanStack Table

```tsx
'use client';

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { useMemo } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function UserTable({ data }: { data: User[] }) {
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
      },
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>
                {flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext()
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Zod Schema Examples

```tsx
import { z } from 'zod';

// Basic types
const emailSchema = z.string().email();
const numberSchema = z.number().min(0).max(100);
const booleanSchema = z.boolean();

// Objects
const userSchema = z.object({
  name: z.string().min(2),
  age: z.number().min(18),
  email: z.string().email(),
});

// Arrays
const tagsSchema = z.array(z.string());

// Unions
const statusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('pending'),
]);

// Enums
const roleSchema = z.enum(['admin', 'user', 'guest']);

// Optional and nullable
const optionalSchema = z.string().optional();
const nullableSchema = z.string().nullable();

// Refinements (custom validation)
const passwordSchema = z.string()
  .min(8)
  .refine(
    (password) => /[A-Z]/.test(password),
    'Password must contain at least one uppercase letter'
  );

// Type inference
type User = z.infer<typeof userSchema>;
```

## 🎯 Advanced Features

### React Hook Form

- **Performance**: Only re-renders the field being validated
- **Built-in validation**: HTML5 validation support
- **Easy integration**: Works with UI libraries
- **TypeScript**: Full type safety
- **DevTools**: Browser extension available

### TanStack Query

- **Caching**: Automatic caching and background updates
- **Deduplication**: Prevents duplicate requests
- **Optimistic updates**: Update UI before server response
- **Infinite queries**: Pagination support
- **DevTools**: Visual query inspector

### TanStack Table

- **Headless**: Full control over UI
- **Sorting**: Multi-column sorting
- **Filtering**: Global and column filters
- **Pagination**: Built-in pagination
- **Selection**: Row selection support
- **Virtualization**: Large dataset support

### Zod

- **Type safety**: Full TypeScript support
- **Composable**: Build complex schemas from simple ones
- **Error messages**: Detailed validation errors
- **Transformations**: Parse and transform data
- **Async validation**: Support for async validators

## 📁 Project Structure

```
webapp/
├── app/
│   └── examples/
│       └── page.tsx              # Examples page showcasing all features
├── components/
│   └── examples/
│       ├── UserForm.tsx          # React Hook Form + Zod example
│       ├── UsersQuery.tsx        # TanStack Query example
│       └── ProductTable.tsx      # TanStack Table example
├── providers/
│   └── QueryProvider.tsx         # TanStack Query provider setup
└── package.json
```

## 🔗 Resources

### Documentation
- [React Hook Form](https://react-hook-form.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [TanStack Table](https://tanstack.com/table/latest)
- [Zod](https://zod.dev/)

### Tutorials
- [React Hook Form Tutorial](https://react-hook-form.com/get-started)
- [TanStack Query Tutorial](https://tanstack.com/query/latest/docs/react/quick-start)
- [TanStack Table Examples](https://tanstack.com/table/latest/docs/examples/react/basic)
- [Zod Schema Examples](https://zod.dev/?id=basic-usage)

## 💡 Best Practices

1. **Form Validation**: Use Zod schemas with React Hook Form for type-safe validation
2. **Data Fetching**: Use TanStack Query for all server state management
3. **Caching**: Configure appropriate stale times for your use case
4. **Error Handling**: Always handle loading and error states
5. **Type Safety**: Use TypeScript with `z.infer` for schema types
6. **Performance**: Use pagination and filtering for large datasets

## 🐛 Troubleshooting

### "Cannot find module" errors
Make sure all dependencies are installed:
```bash
npm install
```

### TanStack Query not working
Ensure your app is wrapped with `QueryProvider`

### Form validation not triggering
Check that you're using `zodResolver` with your schema

### Table not rendering
Verify that you're using `flexRender` for cells and headers

## 🤝 Contributing

When adding new features that use these libraries, please:
1. Follow the established patterns in the examples
2. Add proper TypeScript types
3. Include error handling
4. Update documentation as needed

## 📄 License

This project is part of the hardwarefrontend application.

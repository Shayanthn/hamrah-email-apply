# 🤝 Contributing Guide | راهنمای مشارکت

خوشحالیم که می‌خواهید در بهبود **همراه ایمیل اپلای** مشارکت کنید! 💚

## 📋 فهرست مطالب
- [روش‌های مشارکت](#روش‌های-مشارکت)
- [فرآیند توسعه](#فرآیند-توسعه)
- [استانداردهای کد](#استانداردهای-کد)
- [تست](#تست)
- [Commit Messages](#commit-messages)
- [Pull Request](#pull-request)

## 🎯 روش‌های مشارکت

### 1. گزارش باگ
اگر باگی پیدا کردید:
- بررسی کنید که قبلاً گزارش نشده باشد
- Issue جدید با template مربوطه بسازید
- توضیح دقیق + مراحل بازتولید بنویسید

### 2. پیشنهاد Feature جدید
- ابتدا یک Discussion بسازید
- توضیح دهید چرا این feature مفید است
- منتظر feedback تیم بمانید

### 3. بهبود Documentation
- اصلاح اشکالات املایی/گرامری
- اضافه کردن مثال‌های بیشتر
- ترجمه‌های بهتر

### 4. کد نویسی
- رفع باگ‌ها
- اضافه کردن feature‌های جدید
- بهینه‌سازی performance

## 🛠️ فرآیند توسعه

### نصب و راه‌اندازی

```bash
# 1. Fork کردن repository
# 2. Clone کردن fork خودتان
git clone https://github.com/YOUR-USERNAME/applyhelper.git
cd applyhelper

# 3. نصب dependencies
npm install

# 4. اجرای برنامه در حالت development
npm start

# 5. ساخت نسخه production
npm run build
```

### ساختار Branch

```
main                 # کد stable و آماده release
├── develop          # کد در حال توسعه
├── feature/xxx      # feature های جدید
├── fix/xxx          # رفع باگ
└── hotfix/xxx       # رفع سریع مشکلات critical
```

### Workflow

1. **Fork** repository
2. **Clone** fork خودتان
3. Branch جدید بسازید:
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. تغییرات خود را commit کنید:
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
5. Push به branch خودتان:
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Pull Request** بسازید

## 📝 استانداردهای کد

### TypeScript/JavaScript
```typescript
// ✅ Good
const getUserProfile = async (userId: string): Promise<Profile> => {
  // Implementation
};

// ❌ Bad
function getProfile(id) {
  // No types, unclear name
}
```

### React Components
```tsx
// ✅ Good
interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, disabled = false }) => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className="btn-primary"
    >
      {text}
    </button>
  );
};

// ❌ Bad
const Button = (props) => {
  return <button onClick={props.onClick}>{props.text}</button>;
};
```

### CSS/Tailwind
```tsx
// ✅ Good
<div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">

// ❌ Bad
<div className="flex items-center justify-between p-4" style={{ backgroundColor: 'white' }}>
```

### Naming Conventions
- **Components**: PascalCase (`UserProfile.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **CSS Classes**: kebab-case یا Tailwind

### فارسی در کد
```typescript
// ✅ Good - فارسی برای متن‌های UI
const welcomeMessage = 'خوش آمدید به همراه ایمیل اپلای';

// ✅ Good - انگلیسی برای کد
const getUserEmail = (user: User) => user.email;

// ❌ Bad - فارسی در نام متغیر
const ایمیل_کاربر = user.email;
```

## ✅ تست

### قبل از commit
```bash
# Check TypeScript errors
npm run build

# Run linter
npm run lint

# Format code
npm run format
```

### تست دستی
- [ ] تست در Chrome
- [ ] تست در Firefox  
- [ ] تست در Edge
- [ ] تست در حالت Dark Mode
- [ ] تست Responsive (Mobile/Tablet)
- [ ] تست RTL/LTR

## 📝 Commit Messages

از [Conventional Commits](https://www.conventionalcommits.org/) استفاده می‌کنیم:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: Feature جدید
- `fix`: رفع باگ
- `docs`: تغییرات Documentation
- `style`: تغییرات styling (format, semicolon, etc)
- `refactor`: Refactor کد
- `perf`: بهبود Performance
- `test`: اضافه/تغییر تست‌ها
- `chore`: تغییرات build process یا tools

### مثال‌ها
```bash
feat(premium): add AI-powered features section
fix(email): resolve validation error on empty subject
docs(readme): update installation instructions
style(dashboard): improve card spacing
refactor(database): optimize query performance
```

## 🔄 Pull Request

### قبل از ساخت PR

✅ **Checklist:**
- [ ] کد build می‌شود بدون error
- [ ] تست‌های دستی انجام شده
- [ ] Documentation به‌روز شده
- [ ] Commit messages استاندارد هستند
- [ ] کد clean و readable است

### عنوان PR
```
[Type] Short description

مثال:
[Feature] Add Premium subscription page
[Fix] Resolve email validation bug
[Docs] Update contribution guide
```

### توضیحات PR

```markdown
## 📝 Description
توضیح کوتاه از تغییرات

## 🔗 Related Issues
Closes #123

## ✅ Checklist
- [x] کد تست شده
- [x] Documentation به‌روز شده
- [x] Screenshots اضافه شده (در صورت نیاز)

## 📸 Screenshots
(در صورت تغییرات UI)
```

### Code Review
- تمام PR ها باید review شوند
- حداقل 1 approval لازم است
- تغییرات درخواستی را انجام دهید
- صبور باشید! 😊

## 🌟 بهترین روش‌ها

### DO ✅
- کد clean و readable بنویسید
- comment برای قسمت‌های پیچیده بگذارید
- از TypeScript types استفاده کنید
- Responsive design را رعایت کنید
- Dark mode را تست کنید
- فارسی را در UI به درستی نمایش دهید

### DON'T ❌
- کد غیرضروری commit نکنید
- console.log فراموش نکنید
- کد بدون تست push نکنید
- breaking changes بدون اطلاع ندهید
- بدون discussion feature بزرگ اضافه نکنید

## 💬 ارتباط

سوال دارید؟ کمک می‌خواهید؟

- 📧 ایمیل‌ها: 
  - admin@shayantaherkhani.ir
  - info@stickerino.ir
  - shayanthn78@gmail.com
- 💬 [GitHub Discussions](https://github.com/Shayanthn/hamrah-email-apply/discussions)
- 🐛 [GitHub Issues](https://github.com/Shayanthn/hamrah-email-apply/issues)
- 🌐 Website: [shayantaherkhani.ir](https://shayantaherkhani.ir)

## 🙏 تشکر

از مشارکت شما متشکریم! هر کمکی، کوچک یا بزرگ، ارزشمند است. 💚

---

**Happy Coding!** 🚀

import { Link } from "react-router-dom";

const variants = {
  primary: "btn btn-primary",
  outline: "btn btn-outline",
  ghost: "btn border border-transparent text-muted hover:text-primary"
};

export default function Button({ to, href, variant = "primary", children, className = "", ...props }) {
  const classes = `${variants[variant] || variants.primary} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

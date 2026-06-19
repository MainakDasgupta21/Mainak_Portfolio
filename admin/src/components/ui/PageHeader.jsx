const PageHeader = ({ title, description, actions = null }) => {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-lg font-semibold text-text-main sm:text-xl">{title}</h1>
        {description ? <p className="mt-0.5 text-xs text-text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}

export default PageHeader

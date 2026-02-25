const Pagination = ({ pagination, onPageChange }) => {
  return (
    <div className="flex gap-2 mt-4">
      {pagination.links?.map((link, index) => (
        <button
          key={index}
          onClick={() => link.url && onPageChange(new URL(link.url).searchParams.get("page"))}
          className={`px-3 py-1 border ${
            link.active ? "bg-blue-600 text-white" : ""
          }`}
          dangerouslySetInnerHTML={{ __html: link.label }}
        />
      ))}
    </div>
  );
};

export default Pagination;
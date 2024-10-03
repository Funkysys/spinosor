const PageTitle = ({ title }: { title: string }) => {
  return (
    <h1 className="text-4xl font-bold text-center my-8">
      {title.substring(0, 1).toUpperCase()}
      {title.replace("-", " ").replace("%20", " ").substring(1)}
    </h1>
  );
};

export default PageTitle;

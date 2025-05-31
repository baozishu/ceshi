import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FilterBar = ({ categories, activeFilter, setActiveFilter }) => {
  return (
    <div className="mb-8 w-full max-w-xs">
      <Select
        value={activeFilter}
        onValueChange={(value) => setActiveFilter(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="选择分类" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部作品</SelectItem>
          {categories.map(category => (
            <SelectItem 
              key={category.id} 
              value={category.id}
            >
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterBar;

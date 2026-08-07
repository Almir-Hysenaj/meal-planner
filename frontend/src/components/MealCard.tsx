interface MealCardProps {
  id: number;
  title: string;
  image: string;
  onClick: (id: number) => void;
}

const MealCard = ({ id, title, image, onClick }: MealCardProps) => {
  return (
    <div
      onClick={() => onClick(id)}
      className="
        cursor-pointer
        overflow-hidden
        rounded-xl
        bg-white
        shadow-sm
        border
        border-gray-200
        transition
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      <img src={image} alt={title} className="h-48 w-full object-cover" />

      <div className="p-4">
        <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">
          {title}
        </h3>

        <p className="mt-2 text-sm text-emerald-600">View recipe →</p>
      </div>
    </div>
  );
};

export default MealCard;

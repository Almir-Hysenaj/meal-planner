interface MealCardProps {
  // id: number;
  title: string;
  image: string;
}

const MealCard = ({ title, image }: MealCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={image} alt={title} className="w-full h-48 object-cover" />

      <div className="p-4">
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
    </div>
  );
};

export default MealCard;

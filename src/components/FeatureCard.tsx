import { motion } from "framer-motion";

export const FeatureCard = ({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="p-6 bg-[#424242] rounded-2xl shadow-lg text-center max-w-sm"
    >
      <img src={icon} alt={title} className="mx-auto w-24 h-24 mb-4" />
      <h3 className="text-white font-bebas text-2xl mb-2">{title}</h3>
      <p className="text-[#E5E5E5] font-nunito">{text}</p>
    </motion.div>
  );
};

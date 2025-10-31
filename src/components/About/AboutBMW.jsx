import { motion } from "framer-motion";
import img from "../../assets/about-bmw.png";
import "./AboutBMW.css";

const AboutBMW = () => {
  return (
    <motion.section
      id="about"
      className="about-bmw"
      style={{
        background: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url(${img}) center/cover no-repeat`,
      }}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <div className="container about-inner">
        <motion.div
          className="about-text"
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 1,
            delay: 0.3,
            ease: "easeOut",
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Experience the Ultimate Driving Machine
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            BMW is a symbol of innovation, performance, and luxury. From
            legendary sports cars to elegant SUVs, every model is engineered to
            deliver exceptional driving pleasure.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Our commitment to cutting-edge technology and design ensures that
            every BMW you drive is not just a car, but an experience.
          </motion.p>

          <motion.button
            className="btn"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            Learn More
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AboutBMW;

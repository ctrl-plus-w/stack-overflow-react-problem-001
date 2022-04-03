import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { matrix, multiply, sin, cos, sqrt, pi, unit } from "mathjs";

import "./skills.scss";


function Skills(props) {
  const skills = [
    "HTML",
    "CSS",
    "SCSS",
    "Python",
    "JavaScript",
    "TypeScript",
    "Dart",
    "C++",
    "ReactJS",
    "Angular",
    "VueJS",
    "Flutter",
    "npm",
    "git",
    "pip",
    "Github",
    "Firebase",
    "Google Cloud"
  ].sort(() => 0.5 - Math.random());

  const [points, setPoints] = useState(
    new Array(skills.length).fill([0, 0, -200])
  );
  const [sphereLimit, setSphereLimit] = useState(1);
  const [xRatio, setXRatio] = useState(Math.random() / 2);
  const [yRatio, setYRatio] = useState(Math.random() / 2);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    document.title =
      window.location.pathname === "/skills"
        ? "Josh Pollard | ⚙️"
        : document.title;

    updateWindowDimensions();
    const interval = setInterval(rotateSphere, 100);
    window.addEventListener("resize", updateWindowDimensions);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", updateWindowDimensions);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fibSphere = (samples = skills.length) => {
    // https://stackoverflow.com/a/26127012/10472451
    const newPoints = [];
    const phi = pi * (3 - sqrt(5));

    for (let i = 0; i < samples; i++) {
      const y = (i * 2) / samples - 1;
      const radius = sqrt(1 - y * y);

      const theta = phi * i;

      const x = cos(theta) * radius;
      const z = sin(theta) * radius;

      const itemLimit = sphereLimit * 0.75;

      newPoints.push([x * itemLimit, y * itemLimit, z * itemLimit]);
    }
    console.log(newPoints);
    setPoints(newPoints);
    setIsLoaded(true);
  };

  const rotateSphere = (samples = skills.length) => {
    const newPoints = [];

    const thetaX = unit(-yRatio * 10, "deg");
    const thetaY = unit(xRatio * 10, "deg");
    const thetaZ = unit(0, "deg");

    const rotationMatrix = multiply(
      matrix([
        [1, 0, 0],
        [0, cos(thetaX), -sin(thetaX)],
        [0, sin(thetaX), cos(thetaX)]
      ]),
      matrix([
        [cos(thetaY), 0, sin(thetaY)],
        [0, 1, 0],
        [-sin(thetaY), 0, cos(thetaY)]
      ]),
      matrix([
        [cos(thetaZ), -sin(thetaZ), 0],
        [sin(thetaZ), cos(thetaZ), 0],
        [0, 0, 1]
      ])
    );

    for (let i = 0; i < samples; i++) {
      const currentPoint = points[i];
      const newPoint = multiply(rotationMatrix, currentPoint)._data;

      newPoints.push(newPoint);
    }
    console.log(newPoints[0]);
    setPoints(newPoints);
  };

  const handleMouseMove = (e) => {
    let xPosition = e.clientX;
    let yPosition = e.clientY;

    if (e.type === "touchmove") {
      xPosition = e.touches[0].pageX;
      yPosition = e.touches[0].pageY;
    }

    const spherePosition = document
      .getElementById("sphere")
      .getBoundingClientRect();

    const xDistance = xPosition - spherePosition.width / 2 - spherePosition.x;
    const yDistance = yPosition - spherePosition.height / 2 - spherePosition.y;

    const xRatio = xDistance / sphereLimit;
    const yRatio = yDistance / sphereLimit;

    setXRatio(xRatio);
    setYRatio(yRatio);
  };

  const updateWindowDimensions = () => {
    try {
      const sphere = document.getElementById("sphere");

      if (
        sphereLimit !==
        Math.min(sphere.clientHeight, sphere.clientWidth) / 2
      ) {
        setSphereLimit(Math.min(sphere.clientHeight, sphere.clientWidth) / 2);
        fibSphere();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.div
      className="skills-body"
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
    >
      <div className="skills-info-container">
        <div className="skills-title">Skills</div>
        <div className="skills-description">
          I am a driven and passionate aspiring software engineer. I have
          invested a significant amount of time and effort in self-teaching,
          developing my knowledge and supporting others in the field of digital
          technology. I thrive on the challenge of finding intelligent solutions
          to complex problems and I am keen to apply and grow my skills in the
          workplace.
        </div>
      </div>
      <div className="sphere-container" id="sphere">
        {isLoaded &&
          skills.map((skill, index) => (
            <motion.div
              className="sphere-item"
              key={index}
              initial={{ opacity: 0 }}
              animate={{
                x: points[index][0],
                y: points[index][1] - 20,
                z: points[index][2],
                opacity: Math.max((points[index][2] / sphereLimit + 1) / 2, 0.1)
              }}
              transition={{
                duration: 0.1,
                ease: "linear"
              }}
            >
              {skill}
            </motion.div>
          ))}
      </div>
    </motion.div>
  );
}

export default Skills;

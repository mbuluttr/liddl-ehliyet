export const ImageObjectParser = (image_object) => {
  const new_object = image_object.replace("IMG_", "").split(",");

  return {
    url: new_object[0],
    height: Number(new_object[1]),
    width: Number(new_object[2]),
  };
};

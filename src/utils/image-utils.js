/**
 * Given a list of imagesharp nodes and a list of image contents, set the matching node to each content
 * @param {list} imageSharps A list of ImageSharp nodes
 * @param {list} imageContent A list of imageContents with image properties
 * @returns {list} A list of imageContents with matching images assigned to their "image" property 
 */
export function combineImagesharpWithContent(imageSharps, imageContent) {
  console.log(imageSharps, imageContent);
    return imageContent
      .map(i => {
        var matchingImageSharp = _.find(imageSharps, imageSharp => new RegExp(i.image).test(_.get(imageSharp, 'id')));
        return {
          ...i,
          image: matchingImageSharp
        }
      });
  }
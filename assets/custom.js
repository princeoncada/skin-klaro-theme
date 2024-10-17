fetch('https://aea1f9-3f.myshopify.com/api/2024-10/graphql.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': '99486bbbc2f990fa71e225709deb3bcd',
    },
    body: JSON.stringify({
      query: `
        {
          product(id: "gid://shopify/Product/7726214414393") {
            title
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  metafield(namespace: "custom", key: "highlight_content") {
                    value
                  }
                }
              }
            }
          }
        }
      `,
    }),
  })
    .then(response => response.json())
    .then(data => {
      if (!data || !data.data || !data.data.product) {
        console.error('Error: No data found', data.errors ? data.errors : data);
        return;
      }
  
      const productTitle = data.data.product.title;
      const variants = data.data.product.variants.edges;
  
      console.log(`The product is ${productTitle}, understood?`);
      console.log(`${productTitle} has variants namely:`);
  
      variants.forEach(variant => {
        console.log(variant.node.title);
  
        const highlightContent = variant.node.metafield ? variant.node.metafield.value : null;
        if (highlightContent) {
          console.log(`\n${variant.node.title} has images, highlight content, and hexcode color.`);
  
          // Clean the highlight content to remove extra characters
          const highlightURLs = highlightContent
            .replace(/[\[\]]/g, '') // Remove square brackets
            .split(',') // Split by comma
            .map(url => url.trim().replace(/"/g, '')); // Remove extra quotes and trim whitespace
  
          // Loop through each URL and resolve GIDs to actual URLs
          highlightURLs.forEach(gid => {
            if (gid.startsWith("gid://")) {
              console.log(`\nAttempting to resolve URL for GID: ${gid}`);
              // Make a new GraphQL request to resolve the GID to a URL
              fetch('https://aea1f9-3f.myshopify.com/api/2024-10/graphql.json', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Shopify-Storefront-Access-Token': '99486bbbc2f990fa71e225709deb3bcd',
                },
                body: JSON.stringify({
                  query: `
                    {
                      mediaByIds(ids: ["${gid}"]) {
                        ... on MediaImage {
                          image {
                            originalSrc
                          }
                        }
                      }
                    }
                  `,
                }),
              })
              .then(res => res.json())
              .then(mediaData => {
                if (mediaData && mediaData.data && mediaData.data.mediaByIds) {
                  mediaData.data.mediaByIds.forEach(media => {
                    console.log(`Resolved image URL: ${media.image.originalSrc}`);
                  });
                } else {
                  console.error(`Error resolving GID: ${gid}`);
                }
              })
              .catch(err => console.error('Fetch Error during GID resolution:', err));
            } else {
              console.log(`\nResolved image URL: ${gid}`);
            }
          });
        } else {
          console.log(`\nNo highlight content found for variant ${variant.node.title}`);
        }
      });
    })
    .catch(error => {
      console.error('Fetch Error:', error);
    });

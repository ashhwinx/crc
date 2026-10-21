import { equipmentCategories } from '../data/equipmentData.js';

export const getEquipmentList = (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.json({
    success: true,
    count: equipmentCategories.length,
    disclaimer: 'Equipment catalog represents typical equipment configurations available for leasing inquiry. Specific car availability, series specifications, and delivery timelines are confirmed upon inquiry.',
    data: equipmentCategories,
  });
};

export const getEquipmentById = (req, res) => {
  const { id } = req.params;
  const item = equipmentCategories.find(
    (c) => c.id.toLowerCase() === id.toLowerCase() || c.slug.toLowerCase() === id.toLowerCase()
  );

  if (!item) {
    return res.status(404).json({
      success: false,
      message: `Equipment category '${id}' not found.`,
    });
  }

  res.setHeader('Cache-Control', 'public, max-age=300');
  res.json({
    success: true,
    data: item,
  });
};

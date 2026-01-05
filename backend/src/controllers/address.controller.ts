import { Request, Response } from 'express';
import prisma from '../db.js';

// Validation helper
const validatePhoneNumber = (phone: string): boolean => {
    // Vietnamese phone number format: 10 digits, starts with 0
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
};

const validateAddressData = (data: any): { valid: boolean; error?: string } => {
    const { recipientName, phoneNumber, line1, ward, district, province } = data;
    
    if (!recipientName || recipientName.trim().length === 0) {
        return { valid: false, error: 'Recipient name is required' };
    }
    if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
        return { valid: false, error: 'Valid phone number is required (10 digits, starts with 0)' };
    }
    if (!line1 || line1.trim().length === 0) {
        return { valid: false, error: 'Street address is required' };
    }
    if (!ward || ward.trim().length === 0) {
        return { valid: false, error: 'Ward is required' };
    }
    if (!district || district.trim().length === 0) {
        return { valid: false, error: 'District is required' };
    }
    if (!province || province.trim().length === 0) {
        return { valid: false, error: 'Province is required' };
    }
    
    return { valid: true };
};

export const createAddress = async (req: Request, res: Response) => {
    try {
        const { userId, recipientName, phoneNumber, line1, ward, district, province, isDefault } = req.body;

        // Validate required fields
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const validation = validateAddressData({ recipientName, phoneNumber, line1, ward, district, province });
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        // Check if user exists
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Use transaction to ensure only one default address
        const address = await prisma.$transaction(async (tx) => {
            // If setting as default, unset all other addresses
            if (isDefault) {
                await tx.address.updateMany({
                    where: { userId },
                    data: { isDefault: false },
                });
            }

            return await tx.address.create({
                data: {
                    userId,
                    recipientName: recipientName.trim(),
                    phoneNumber: phoneNumber.trim(),
                    line1: line1.trim(),
                    ward: ward.trim(),
                    district: district.trim(),
                    province: province.trim(),
                    isDefault: isDefault || false,
                },
            });
        });

        res.status(201).json(address);
    } catch (error: any) {
        console.error('Error creating address:', error);
        res.status(400).json({ error: error.message || 'Failed to create address' });
    }
};

export const getAddressById = async (req: Request, res: Response) => {
    try {
        const address = await prisma.address.findUnique({
            where: { id: req.params.id },
        });
        if (!address) {
            return res.status(404).json({ error: 'Address not found' });
        }
        res.json(address);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const updateAddress = async (req: Request, res: Response) => {
    try {
        const { recipientName, phoneNumber, line1, ward, district, province, isDefault } = req.body;

        const address = await prisma.address.findUnique({
            where: { id: req.params.id },
        });

        if (!address) {
            return res.status(404).json({ error: 'Address not found' });
        }

        // Validate if updating fields
        if (recipientName || phoneNumber || line1 || ward || district || province) {
            const validation = validateAddressData({
                recipientName: recipientName || address.recipientName,
                phoneNumber: phoneNumber || address.phoneNumber,
                line1: line1 || address.line1,
                ward: ward || address.ward,
                district: district || address.district,
                province: province || address.province,
            });
            if (!validation.valid) {
                return res.status(400).json({ error: validation.error });
            }
        }

        // Use transaction to ensure only one default address
        const updatedAddress = await prisma.$transaction(async (tx) => {
            // If setting as default, unset all other addresses of the same user
            if (isDefault === true) {
                await tx.address.updateMany({
                    where: { userId: address.userId, id: { not: req.params.id } },
                    data: { isDefault: false },
                });
            }

            return await tx.address.update({
                where: { id: req.params.id },
                data: {
                    ...(recipientName && { recipientName: recipientName.trim() }),
                    ...(phoneNumber && { phoneNumber: phoneNumber.trim() }),
                    ...(line1 && { line1: line1.trim() }),
                    ...(ward && { ward: ward.trim() }),
                    ...(district && { district: district.trim() }),
                    ...(province && { province: province.trim() }),
                    ...(isDefault !== undefined && { isDefault }),
                },
            });
        });

        res.json(updatedAddress);
    } catch (error: any) {
        console.error('Error updating address:', error);
        res.status(400).json({ error: error.message || 'Failed to update address' });
    }
};

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        const address = await prisma.address.findUnique({
            where: { id: req.params.id },
        });

        if (!address) {
            return res.status(404).json({ error: 'Address not found' });
        }

        // Check if this is the only address
        const addressCount = await prisma.address.count({
            where: { userId: address.userId },
        });

        if (addressCount === 1) {
            return res.status(400).json({ 
                error: 'Cannot delete the only address. Please add another address first.' 
            });
        }

        // Check if trying to delete default address and there are other addresses
        if (address.isDefault && addressCount > 1) {
            // Set the first non-default address as default
            const otherAddress = await prisma.address.findFirst({
                where: { 
                    userId: address.userId, 
                    id: { not: req.params.id } 
                },
            });

            if (otherAddress) {
                await prisma.$transaction(async (tx) => {
                    await tx.address.update({
                        where: { id: otherAddress.id },
                        data: { isDefault: true },
                    });
                    await tx.address.delete({
                        where: { id: req.params.id },
                    });
                });
            } else {
                await prisma.address.delete({
                    where: { id: req.params.id },
                });
            }
        } else {
            await prisma.address.delete({
                where: { id: req.params.id },
            });
        }

        res.status(204).send();
    } catch (error: any) {
        console.error('Error deleting address:', error);
        res.status(400).json({ error: error.message || 'Failed to delete address' });
    }
};

export const setAddressDefault = async (req: Request, res: Response) => {
    try {
        const address = await prisma.address.findUnique({
            where: { id: req.params.id },
        });

        if (!address) {
            return res.status(404).json({ error: 'Address not found' });
        }

        // Use transaction to ensure atomicity
        const updatedAddress = await prisma.$transaction(async (tx) => {
            // Unset all other addresses of the same user
            await tx.address.updateMany({
                where: { userId: address.userId, id: { not: req.params.id } },
                data: { isDefault: false },
            });

            // Set this address as default
            return await tx.address.update({
                where: { id: req.params.id },
                data: { isDefault: true },
            });
        });

        res.json(updatedAddress);
    } catch (error: any) {
        console.error('Error setting default address:', error);
        res.status(400).json({ error: error.message || 'Failed to set default address' });
    }
};

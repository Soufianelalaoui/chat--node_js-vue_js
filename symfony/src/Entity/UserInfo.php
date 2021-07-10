<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use App\Repository\UserInfoRepository;
use DateTimeInterface;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
 *     normalizationContext={"groups"={"user:read"}},
 *     denormalizationContext={"groups"={"user:write"}}
 * )
 * @ORM\Entity(repositoryClass=UserInfoRepository::class)
 */
class UserInfo
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"user:read", "user:write"})
     */
    private $id;

    /**
     * @ORM\Column(type="date", nullable=true)
     * @Groups({"user:read", "user:write"})
     */
    private $birthday;

    /**
     * @ORM\Column(type="string", length=50, nullable=true)
     * @Groups({"user:read", "user:write"})
     */
    private $sex;

    /**
     * @ORM\Column(type="string", length=50, nullable=true)
     * @Groups({"user:read", "user:write"})
     */
    private $picture;

    /**
     * @ORM\Column(type="integer")
     */
    private $warns;

    /**
     * @ORM\Column(type="boolean")
     */
    private $banned;

    /**
     * @ORM\Column(type="boolean")
     */
    private $disabled;


    /**
     * @ORM\Column(type="string", length=50)
     * @Groups({"user:read", "user:write"})
     */
    private $textColor;

    /**
     * @ORM\Column(type="string", length=50)
     * @Groups({"user:read", "user:write"})
     */
    private $backgroundColor;

    /**
     * @ORM\OneToOne(targetEntity=User::class, inversedBy="userInfo", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     * @ApiSubresource()
     */
    private $User;

    /**
     * UserInfo constructor.
     * @param User $user
     */
    public function __construct(User $user)
    {
        $this->warns = 0;
        $this->banned = false;
        $this->disabled = false;
        $this->textColor = "#00000";
        $this->backgroundColor = "#00000";
        $this->setUser($user);
    }


    public function getId(): ?int
    {
        return $this->id;
    }


    public function getBirthday(): ?DateTimeInterface
    {
        return $this->birthday;
    }

    public function setBirthday(?DateTimeInterface $birthday): self
    {
        $this->birthday = $birthday;

        return $this;
    }

    public function getSex(): ?string
    {
        return $this->sex;
    }

    public function setSex(?string $sex): self
    {
        $this->sex = $sex;

        return $this;
    }

    public function getPicture(): ?string
    {
        return $this->picture;
    }

    public function setPicture(?string $picture): self
    {
        $this->picture = $picture;

        return $this;
    }

    public function getWarns(): ?int
    {
        return $this->warns;
    }

    public function setWarns(int $warns): self
    {
        $this->warns = $warns;

        return $this;
    }

    public function getBanned(): ?bool
    {
        return $this->banned;
    }

    public function setBanned(bool $banned): self
    {
        $this->banned = $banned;

        return $this;
    }

    public function getDisabled(): ?bool
    {
        return $this->disabled;
    }

    public function setDisabled(bool $disabled): self
    {
        $this->disabled = $disabled;

        return $this;
    }


    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    public function getTextColor(): ?string
    {
        return $this->textColor;
    }

    public function setTextColor(string $textColor): self
    {
        $this->textColor = $textColor;

        return $this;
    }

    public function getBackgroundColor(): ?string
    {
        return $this->backgroundColor;
    }

    public function setBackgroundColor(string $backgroundColor): self
    {
        $this->backgroundColor = $backgroundColor;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->User;
    }

    public function setUser(User $User): self
    {
        $this->User = $User;

        return $this;
    }


}

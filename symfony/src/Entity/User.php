<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\SerializedName;

/**
 * @ApiResource(
 *
 *     normalizationContext={"groups"={"user:read","userInfo","uinfo"}},
 *     denormalizationContext={"groups"={"user:write"}}
 * )
 * @ORM\Entity(repositoryClass=UserRepository::class)
 */
class User implements UserInterface
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     *
     * @Groups("user:read")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=50, unique=true)
     *
     * @Groups({"user:read", "user:write"})
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=150, nullable=true)
     */
    private $password;

    /**
     * @Groups("user:write")
     * @SerializedName("password")
     */
    private $plainPassword;

    /**
     * @ORM\Column(type="boolean")
     *
     * @Groups({"user:read", "user:write"})
     */
    private $facebook;

    /**
     * @ORM\Column(type="string", length=150)
     *
     * @Groups({"user:read", "user:write"})
     */
    private $username;

    /**
     * @ORM\Column(type="json")
     */
    private $roles = [];

    /**
     * @ORM\OneToOne(targetEntity=UserInfo::class, mappedBy="User", cascade={"persist", "remove"})
     * @ApiSubresource
     * @Groups("uinfo")
     */
    private $userInfo;

    /**
     * @ORM\OneToMany(targetEntity=Report::class, mappedBy="reporterUser")
     *
     */
    private $reports;

    /**
     * @ORM\OneToMany(targetEntity=Report::class, mappedBy="reportedUser")
     */
    private $reportsGot;

    /**
     * @ORM\OneToMany(targetEntity=FriendRequest::class, mappedBy="requesterUser")
     */
    private $sentFriendRequests;

    /**
     * @ORM\OneToMany(targetEntity=FriendRequest::class, mappedBy="requestedUser")
     */
    private $friendRequestsGot;


    public function __construct()
    {
        $this->userInfo = new UserInfo($this);
        $this->roles = array('ROLE_USER');

        $this->reports = new ArrayCollection();
        $this->reportsGot = new ArrayCollection();
        $this->sentFriendRequests = new ArrayCollection();
        $this->friendRequestsGot = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getPlainPassword()
    {
        return $this->plainPassword;
    }

    /**
     * @param mixed $plainPassword
     */
    public function setPlainPassword($plainPassword): void
    {
        $this->plainPassword = $plainPassword;
    }

    public function getFacebook(): ?bool
    {
        return $this->facebook;
    }

    public function setFacebook(bool $facebook): self
    {
        $this->facebook = $facebook;

        return $this;
    }



    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }


    /**
     * @return mixed
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * @param mixed $username
     */
    public function setUsername($username): void
    {
        $this->username = $username;
    }

    public function getSalt()
    {
        // TODO: Implement getSalt() method.
    }


    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        $this->plainPassword = null;
    }

    public function getUserInfo(): ?UserInfo
    {
        return $this->userInfo;
    }

    public function setUserInfo(UserInfo $userInfo): self
    {
        // set the owning side of the relation if necessary
        if ($userInfo->getUser() !== $this) {
            $userInfo->setUser($this);
        }

        $this->userInfo = $userInfo;

        return $this;
    }

    /**
     * @return Collection|Report[]
     */
    public function getReports(): Collection
    {
        return $this->reports;
    }

    public function addReport(Report $report): self
    {
        if (!$this->reports->contains($report)) {
            $this->reports[] = $report;
            $report->setReporterUser($this);
        }

        return $this;
    }

    public function removeReport(Report $report): self
    {
        if ($this->reports->removeElement($report)) {
            // set the owning side to null (unless already changed)
            if ($report->getReporterUser() === $this) {
                $report->setReporterUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Report[]
     */
    public function getReportsGot(): Collection
    {
        return $this->reportsGot;
    }

    public function addReportsGot(Report $reportsGot): self
    {
        if (!$this->reportsGot->contains($reportsGot)) {
            $this->reportsGot[] = $reportsGot;
            $reportsGot->setReportedUser($this);
        }

        return $this;
    }

    public function removeReportsGot(Report $reportsGot): self
    {
        if ($this->reportsGot->removeElement($reportsGot)) {
            // set the owning side to null (unless already changed)
            if ($reportsGot->getReportedUser() === $this) {
                $reportsGot->setReportedUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|FriendRequest[]
     */
    public function getSentFriendRequests(): Collection
    {
        return $this->sentFriendRequests;
    }

    public function addSentFriendRequest(FriendRequest $sentFriendRequest): self
    {
        if (!$this->sentFriendRequests->contains($sentFriendRequest)) {
            $this->sentFriendRequests[] = $sentFriendRequest;
            $sentFriendRequest->setRequesterUser($this);
        }

        return $this;
    }

    public function removeSentFriendRequest(FriendRequest $sentFriendRequest): self
    {
        if ($this->sentFriendRequests->removeElement($sentFriendRequest)) {
            // set the owning side to null (unless already changed)
            if ($sentFriendRequest->getRequesterUser() === $this) {
                $sentFriendRequest->setRequesterUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|FriendRequest[]
     */
    public function getFriendRequestsGot(): Collection
    {
        return $this->friendRequestsGot;
    }

    public function addFriendRequestsGot(FriendRequest $friendRequestsGot): self
    {
        if (!$this->friendRequestsGot->contains($friendRequestsGot)) {
            $this->friendRequestsGot[] = $friendRequestsGot;
            $friendRequestsGot->setRequestedUser($this);
        }

        return $this;
    }

    public function removeFriendRequestsGot(FriendRequest $friendRequestsGot): self
    {
        if ($this->friendRequestsGot->removeElement($friendRequestsGot)) {
            // set the owning side to null (unless already changed)
            if ($friendRequestsGot->getRequestedUser() === $this) {
                $friendRequestsGot->setRequestedUser(null);
            }
        }

        return $this;
    }


}
